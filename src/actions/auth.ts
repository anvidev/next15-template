'use server'

import { ResetAccountProvider } from '@/components/emails/reset-account-provider'
import { adminAction, authedAction, publicAction } from '@/lib/safe-action'
import { getServerSchema } from '@/lib/validations'
import {
	acceptAndRegisterValidation,
	createPinValidation,
	createVerificationValidation,
	deleteUserValidation,
	inviteUsersValidation,
	resetPinValidation,
	signInValidation,
	signUpValidation,
	updateProfileValidation,
	updateUserRoleValidation,
	updateUserStatusValidation,
	verifyValidation,
} from '@/schemas/auth'
import { authService } from '@/service/auth/service'
import { emailService } from '@/service/emails/emails'
import { SessionPlatform } from '@/store/auth/models'
import { flattenValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { env } from 'process'

async function getSignUpSchema() {
	return getServerSchema(signUpValidation, 'validations')
}

export const signUpAction = publicAction
	.metadata({ actionName: 'signUpAction' })
	.inputSchema(getSignUpSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		await authService.registerTenant(parsedInput)
	})

async function getSignInSchema() {
	return await getServerSchema(signInValidation, 'validations')
}

export const signInAction = publicAction
	.metadata({ actionName: 'signInAction' })
	.inputSchema(getSignInSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const authorized = await authService.authorizeCredentials(parsedInput)
		const newSession = await authService.createSession(
			authorized.id,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})

async function getVerifySchema() {
	return await getServerSchema(verifyValidation, 'validations')
}

export const verifyAction = publicAction
	.metadata({ actionName: 'verifyAction' })
	.inputSchema(getVerifySchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const { token } = parsedInput
		const verification = await authService.confirmVerification(token)
		const newSession = await authService.createSession(
			verification.userId,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})

async function getUpdateRoleSchema() {
	return await getServerSchema(updateUserRoleValidation, 'validations')
}

export const updateRoleAction = adminAction
	.metadata({ actionName: 'updateRoleAction' })
	.inputSchema(getUpdateRoleSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, tenant, locale } = ctx
		const { ids, role } = parsedInput
		for (const id of ids) {
			if (id === user.id) continue
			await authService.updateUserRole(id, tenant.id, role)
		}
		revalidatePath(`/${locale}/administration/users`)
	})

async function getDeleteUserSchema() {
	return await getServerSchema(deleteUserValidation, 'validations')
}

export const deleteUsersAction = adminAction
	.metadata({ actionName: 'deleteUsersAction' })
	.inputSchema(getDeleteUserSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { tenant, user, locale } = ctx
		const { ids } = parsedInput
		for (const id of ids) {
			if (id === user.id) continue
			await authService.deleteUser(id, tenant.id)
		}
		revalidatePath(`/${locale}/administration/users`)
	})

async function getInviteUsersSchema() {
	return await getServerSchema(inviteUsersValidation, 'validations')
}

export const inviteUsersAction = adminAction
	.metadata({ actionName: 'inviteUsersAction' })
	.inputSchema(getInviteUsersSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { tenant, user, locale } = ctx
		const { invitations, expiresInDays, role } = parsedInput
		const invitationPromises = []
		for (const invitation of invitations) {
			invitationPromises.push(
				authService.createInvitation(
					tenant.id,
					user.id,
					invitation.email,
					role,
					expiresInDays,
				),
			)
		}
		await Promise.all(invitationPromises)
		revalidatePath(`/${locale}/administration/users`)
	})

async function getAcceptInviteSchema() {
	return await getServerSchema(acceptAndRegisterValidation, 'validations')
}

export const acceptInviteAction = publicAction
	.metadata({ actionName: 'acceptInviteAction' })
	.inputSchema(getAcceptInviteSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const { token, name, email, password } = parsedInput
		const { user } = await authService.acceptInvitation(
			token,
			name,
			email,
			password,
		)
		const newSession = await authService.createSession(
			user.id,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})

async function getUpdateStatusSchema() {
	return await getServerSchema(updateUserStatusValidation, 'validations')
}

export const updateStatusAction = adminAction
	.metadata({ actionName: 'updateStatusAction' })
	.inputSchema(getUpdateStatusSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, tenant, locale } = ctx
		const { ids, active } = parsedInput
		for (const id of ids) {
			if (user.id === id) continue
			await authService.updateUserStatus(id, tenant.id, active)
		}
		revalidatePath(`/${locale}/administration/users`)
	})

async function getCreatePinSchema() {
	return await getServerSchema(createPinValidation, 'validations')
}

export const createPinAction = authedAction
	.metadata({ actionName: 'createPinAction' })
	.inputSchema(getCreatePinSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, locale } = ctx
		const { pin } = parsedInput
		await authService.createPin(user.id, pin)
		revalidatePath(`/${locale}/account`)
	})

export const deleteOwnUserAction = authedAction
	.metadata({ actionName: 'deleteOwnUserAction' })
	.action(async ({ ctx }) => {
		const { user, tenant } = ctx
		await authService.deleteUser(user.id, tenant.id)
	})

async function getCreateVerificationSchema() {
	return await getServerSchema(createVerificationValidation, 'validations')
}

export const resetAccountProviderAction = authedAction
	.metadata({ actionName: 'resetAccountProviderAction' })
	.inputSchema(getCreateVerificationSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { type } = parsedInput
		const { user } = ctx
		const verification = await authService.createVerification(user.id, type)
		await emailService.sendRecursively(
			[user.email],
			`Reset ${type} provider`,
			ResetAccountProvider({
				environment: env.NODE_ENV,
				token: verification.token,
				type,
			}),
		)
	})

async function getUpdateOwnProfileSchema() {
	return await getServerSchema(updateProfileValidation, 'validations')
}

export const updateOwnProfileAction = authedAction
	.metadata({ actionName: 'updateOwnProfileAction' })
	.inputSchema(getUpdateOwnProfileSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { name, image } = parsedInput
		const { user, tenant, locale } = ctx
		await authService.updateUserProfile(user.id, tenant.id, {
			name,
			image: image == '' ? null : image,
		})
		revalidatePath(`/${locale}/account`)
	})

async function getResetPinSchema() {
	return await getServerSchema(resetPinValidation, 'validations')
}

export const resetPinAction = publicAction
	.metadata({ actionName: 'resetPinAction' })
	.inputSchema(getResetPinSchema)
	.action(async ({ parsedInput }) => {
		const { token, pin } = parsedInput
	})
