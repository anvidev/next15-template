import { db, Tx } from '@/lib/database/connection'
import {
	accountsTable,
	sessionsTable,
	tenantsTable,
	usersTable,
	verificationsTable,
} from '@/lib/database/schema/auth'
import {
	and,
	asc,
	between,
	count,
	desc,
	eq,
	inArray,
	isNull,
	like,
	or,
	SQL,
	sql,
} from 'drizzle-orm'
import {
	Account,
	AccountProvider,
	NewAccount,
	NewSession,
	NewTenant,
	NewUser,
	NewVerification,
	Session,
	Tenant,
	User,
	Verification,
} from './models'
import { ListUsersFilters } from './validations'

export const authStore = {
	createSession: async function (
		input: NewSession,
		tx: Tx = db,
	): Promise<Session> {
		const [session] = await tx.insert(sessionsTable).values(input).returning()
		return session
	},
	deleteSession: async function (
		token: Session['token'],
		tx: Tx = db,
	): Promise<boolean> {
		const result = await tx
			.delete(sessionsTable)
			.where(eq(sessionsTable.token, token))
		return result.rowsAffected === 1
	},
	getSession: async function (
		token: string,
		tx: Tx = db,
	): Promise<Session | undefined> {
		const rows = await tx
			.select()
			.from(sessionsTable)
			.where(eq(sessionsTable.token, token))
		return rows.at(0)
	},
	extendSession: async function (
		id: string,
		expiry: Date,
		tx: Tx = db,
	): Promise<Session> {
		const [session] = await tx
			.update(sessionsTable)
			.set({ expiresAt: expiry })
			.where(eq(sessionsTable.id, id))
			.returning()
		return session
	},
	createAccount: async function (
		input: NewAccount,
		tx: Tx = db,
	): Promise<Account> {
		const [account] = await tx.insert(accountsTable).values(input).returning()
		return account
	},
	getAccount: async function (
		id: User['id'],
		provider: AccountProvider,
		tx: Tx = db,
	): Promise<Account | undefined> {
		const rows = await tx
			.select()
			.from(accountsTable)
			.where(
				and(eq(accountsTable.provider, provider), eq(accountsTable.userId, id)),
			)
		return rows.at(0)
	},
	getUserById: async function (
		id: string,
		tx: Tx = db,
	): Promise<User | undefined> {
		const rows = await tx.select().from(usersTable).where(eq(usersTable.id, id))
		return rows.at(0)
	},
	getUserByEmail: async function (
		email: string,
		tx: Tx = db,
	): Promise<User | undefined> {
		const rows = await tx
			.select()
			.from(usersTable)
			.where(eq(sql`lower(${usersTable.email})`, email.toLowerCase()))
		return rows.at(0)
	},
	createUser: async function (input: NewUser, tx: Tx = db): Promise<User> {
		const [user] = await tx.insert(usersTable).values(input).returning()
		return user
	},
	listUsers: async function (
		tenantId: Tenant['id'],
		filters: ListUsersFilters,
		tx: Tx = db,
	): Promise<{ users: User[]; pageCount: number }> {
		const conditions: (SQL | undefined)[] = [eq(usersTable.tenantId, tenantId)]

		if (filters.q.trim() !== '') {
			const searchTerm = `%${filters.q.toLowerCase().trim()}%`
			conditions.push(
				or(
					like(sql`lower(${usersTable.name})`, searchTerm),
					like(sql`lower(${usersTable.email})`, searchTerm),
				),
			)
		}
		if (filters.name.trim() !== '') {
			const searchTerm = `%${filters.name.toLowerCase().trim()}%`
			conditions.push(like(sql`lower(${usersTable.name})`, searchTerm))
		}
		if (filters.email.trim() !== '') {
			const searchTerm = `%${filters.email.toLowerCase().trim()}%`
			conditions.push(like(sql`lower(${usersTable.email})`, searchTerm))
		}
		if (filters.role?.length) {
			conditions.push(inArray(usersTable.role, filters.role))
		}
		if (typeof filters.emailVerified === 'boolean') {
			conditions.push(eq(usersTable.emailVerified, filters.emailVerified))
		}
		if (filters.createdAt?.length === 2) {
			const [startDate, endDate] = filters.createdAt
			const endOfDay = new Date(endDate)
			endOfDay.setHours(23, 59, 59, 999)
			conditions.push(between(usersTable.createdAt, startDate, endOfDay))
		}

		const rows = tx
			.select()
			.from(usersTable)
			.where(and(...conditions))

		if (filters?.perPage) {
			rows.limit(filters.perPage)

			if (filters.page && filters.page > 0) {
				rows.offset((filters.page - 1) * filters.perPage)
			}
		}
		if (filters?.sort) {
			const orders: SQL[] = []
			filters.sort.forEach(s => {
				const orderBy = s.desc ? desc : asc
				orders.push(orderBy(usersTable[s.id]))
			})
			rows.orderBy(...orders)
		}

		const totalRows = tx
			.select({ count: count() })
			.from(usersTable)
			.where(and(...conditions))
			.then(result => result.at(0)?.count ?? 0)

		const [users, total] = await Promise.all([rows, totalRows])

		const pageCount = Math.ceil(total / filters.perPage)

		return { users, pageCount }
	},
	getTenantById: async function (
		id: string,
		tx: Tx = db,
	): Promise<Tenant | undefined> {
		const rows = await tx
			.select()
			.from(tenantsTable)
			.where(eq(tenantsTable.id, id))
		return rows.at(0)
	},
	getTenantBySlug: async function (
		slug: string,
		tx: Tx = db,
	): Promise<Tenant | undefined> {
		const rows = await tx
			.select()
			.from(tenantsTable)
			.where(eq(tenantsTable.slug, slug))
		return rows.at(0)
	},
	createTenant: async function (
		input: NewTenant,
		tx: Tx = db,
	): Promise<Tenant> {
		const [tenant] = await tx.insert(tenantsTable).values(input).returning()
		return tenant
	},
	createVerification: async function (
		input: NewVerification,
		tx: Tx = db,
	): Promise<Verification> {
		const [verification] = await tx
			.insert(verificationsTable)
			.values(input)
			.returning()
		return verification
	},
	updateVerification: async function (
		token: Verification['token'],
		input: Partial<Pick<Verification, 'expiresAt' | 'verifiedAt'>>,
		tx: Tx = db,
	): Promise<Verification> {
		const [verification] = await tx
			.update(verificationsTable)
			.set({
				...input,
			})
			.where(eq(verificationsTable.token, token))
			.returning()
		return verification
	},
	getVerification: async function (
		token: string,
		tx: Tx = db,
	): Promise<Verification | undefined> {
		const rows = await tx
			.select()
			.from(verificationsTable)
			.where(
				and(
					eq(verificationsTable.token, token),
					isNull(verificationsTable.verifiedAt),
				),
			)
		return rows.at(0)
	},
}
