import { EmailTemplate } from '@/components/emails/verify-email'
import { db } from '@/lib/database/connection'
import { FROM, resend } from '@/lib/resend'
import { ApplicationError } from '@/lib/safe-action'
import { generateRandomString, slugify } from '@/lib/utils'
import { SignInInput, SignUpInput } from '@/schemas/auth'
import { authStore } from '@/store/auth/data'
import {
	AccountProvider,
	Session,
	SessionPlatform,
	Tenant,
	User,
	Verification,
	VerificationType,
} from '@/store/auth/models'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { addDays, isWithinInterval, subDays } from 'date-fns'
import { cookies } from 'next/headers'
import { env } from 'process'
import { cache } from 'react'

const SESSION_COOKIE = 'session'

export const authService = {
	verify: cache(async function (): Promise<
		| {
				session: Session
				user: User
				tenant: Tenant
		  }
		| {
				session: null
				user: null
				tenant: null
		  }
	> {
		const cookieStore = await cookies()

		const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value
		if (!sessionCookie) {
			return { session: null, user: null, tenant: null }
		}

		const session = await authStore.getSession(sessionCookie)
		if (!session) {
			return { session: null, user: null, tenant: null }
		}

		const closeToExpired = isWithinInterval(new Date(), {
			start: subDays(session.expiresAt, 1),
			end: session.expiresAt,
		})
		if (closeToExpired) {
			const newExpiry = addDays(new Date(), 3)
			await authStore.extendSession(session.id, newExpiry)
		}

		const user = await authStore.getUserById(session.userId)
		if (!user) {
			return { session: null, user: null, tenant: null }
		}

		const tenant = await authStore.getTenantById(user.tenantId)
		if (!tenant) {
			return { session: null, user: null, tenant: null }
		}

		return { session, user, tenant }
	}),
	authorizeCredentials: async function (input: SignInInput): Promise<User> {
		const { email, password } = input

		const user = await authStore.getUserByEmail(email)
		if (!user) {
			throw new ApplicationError(
				'Invalid credentials',
				'Service: Unauthorized',
				{ message: 'User was not found', email },
			)
		}

		const account = await authStore.getAccount(
			user.id,
			AccountProvider.Credential,
		)
		if (!account) {
			throw new ApplicationError(
				'Invalid credentials',
				'Service: Unauthorized',
				{
					message: 'Account was not found',
					email,
					provider: AccountProvider.Credential,
				},
			)
		}
		if (!account.passwordHash) {
			throw new ApplicationError(
				'Invalid credentials',
				'Service: Unauthorized',
				{ message: 'Account has no password hash', email },
			)
		}

		const samePassword = await bcrypt.compare(password, account.passwordHash)
		if (!samePassword) {
			throw new ApplicationError(
				'Invalid credentials',
				'Service: Unauthorized',
				{ message: 'Incorrect password', email },
			)
		}

		return user
	},
	createSession: async function (
		id: User['id'],
		platform: SessionPlatform,
		duration = 7,
	): Promise<Session> {
		if (duration < 1 || duration > 30) {
			throw new ApplicationError(
				'Session duration must be between 1 and 30 days',
				'Service: Validation Error',
				{ duration },
			)
		}
		const expiresAt = addDays(new Date(), duration)
		const token = randomBytes(64).toString('hex')
		return authStore.createSession({
			id: generateRandomString(32, 'session_'),
			userId: id,
			token: token,
			expiresAt: expiresAt,
			platform: platform,
		})
	},
	setSessionCookie: async function (
		token: Session['token'],
		duration = 7,
	): Promise<void> {
		if (duration < 1 || duration > 30) {
			throw new ApplicationError(
				'Session duration must be between 1 and 30 days',
				'Service: Validation Error',
				{ duration },
			)
		}
		const expiry = addDays(new Date(), duration)
		const cookieStore = await cookies()
		cookieStore.set(SESSION_COOKIE, token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: expiry,
			path: '/',
		})
	},
	registerTenant: async function (
		input: SignUpInput,
	): Promise<{ tenant: Tenant; user: User }> {
		const { organizationName, name, email, password } = input

		const slug = slugify(organizationName)

		const [existingUser, existingTenant] = await Promise.all([
			authStore.getUserByEmail(email),
			authStore.getTenantBySlug(slug),
		])

		if (existingUser) {
			throw new ApplicationError(
				'An account with this email already exists',
				'Service: Conflict',
				{ name, email },
			)
		}
		if (existingTenant) {
			throw new ApplicationError(
				'An organization with this name already exists',
				'Service: Conflict',
				{ organizationName, name, email },
			)
		}

		const transaction = await db.transaction(async tx => {
			const newTenant = await authStore.createTenant(
				{
					id: generateRandomString(32, 'tenant_'),
					name: organizationName,
					slug: slugify(organizationName),
				},
				tx,
			)

			const newAdminUser = await authStore.createUser(
				{
					id: generateRandomString(32, 'user_'),
					name,
					email,
					tenantId: newTenant.id,
					active: false,
					emailVerified: false,
				},
				tx,
			)

			const passwordHash = await bcrypt.hash(password, 12)

			await authStore.createAccount(
				{
					id: generateRandomString(32, 'account_'),
					provider: AccountProvider.Credential,
					userId: newAdminUser.id,
					passwordHash: passwordHash,
				},
				tx,
			)

			const newVerification = await authStore.createVerification(
				{
					id: generateRandomString(32, 'verification_'),
					userId: newAdminUser.id,
					type: VerificationType.Email,
					expiresAt: addDays(new Date(), 1),
					token: generateRandomString(32),
				},
				tx,
			)

			const { error } = await resend.emails.send({
				from: FROM,
				to: [newAdminUser.email],
				subject: 'Welcome to [PROJ_NAME] - [TRANSLATE LATER]',
				react: EmailTemplate({
					name: newAdminUser.name,
					token: newVerification.token,
					environment: env.NODE_ENV,
				}),
			})
			if (error) {
				try {
					tx.rollback()
				} catch (e) {}
				throw new ApplicationError(
					'Failed to send verification email',
					'Service: Internal Server Error',
					{ message: error.message, newAdminUser, newTenant },
				)
			}

			return { tenant: newTenant, user: newAdminUser }
		})

		return transaction
	},
	registerUser: async function () {},
	invalidateSession: async function (
		token: Session['token'],
	): Promise<boolean> {
		const cookieStore = await cookies()
		cookieStore.set(SESSION_COOKIE, token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			expires: 0,
			path: '/',
		})

		return authStore.deleteSession(token)
	},
	getVerification: async function (token: string): Promise<Verification> {
		const verification = await authStore.getVerification(token)
		if (!verification) {
			throw new ApplicationError(
				'Verification token was not found or has already been used',
				'Service: Not Found',
				{ token },
			)
		}
		return verification
	},
	confirmVerification: async function (token: string): Promise<Verification> {
		return authStore.updateVerification(token, { verifiedAt: new Date() })
	},
	listUsers: async function (tenantId: Tenant['id']): Promise<User[]> {
		return await authStore.listUsers(tenantId)
	},
}
