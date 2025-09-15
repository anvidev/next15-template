import {
	AccountProvider,
	InvitationStatus,
	ResetRequestType,
	Role,
	SessionPlatform,
	VerificationType,
} from '@/store/auth/models'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const usersTable = sqliteTable('users', {
	id: text('id').primaryKey(),
	tenantId: text('tenant_id')
		.references(() => tenantsTable.id, { onDelete: 'cascade' })
		.notNull(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	active: integer('active', { mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	role: text('role').$type<Role>().default(Role.User).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
})

export const sessionsTable = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	platform: text('platform').$type<SessionPlatform>().notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
})

export const verificationsTable = sqliteTable('verifications', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	type: text('type').$type<VerificationType>().notNull(),
	token: text('token').unique().notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	verifiedAt: integer('verified_at', { mode: 'timestamp' }),
	meta: text('meta', { mode: 'json' }).$type<Record<string, any>>(),
})

export const tenantsTable = sqliteTable('tenants', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').unique().notNull(),
	logo: text('logo'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.$onUpdateFn(() => new Date())
		.notNull(),
})

export const invitationsTable = sqliteTable('invitations', {
	id: text('id').primaryKey(),
	tenantId: text('tenant_id')
		.notNull()
		.references(() => tenantsTable.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	email: text('email').notNull(),
	role: text('role').$type<Role>().default(Role.User).notNull(),
	status: text('status')
		.$type<InvitationStatus>()
		.default(InvitationStatus.Pending)
		.notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	inviterId: text('inviter_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
	userId: text('user_id').references(() => usersTable.id),
})

export const accountsTable = sqliteTable('accounts', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	provider: text('provider').$type<AccountProvider>().notNull(),
	passwordHash: text('password_hash'),
	pinHash: text('pin_hash'),
})

export const resetRequestsTable = sqliteTable('reset_requests', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => usersTable.id, { onDelete: 'cascade' })
		.notNull(),
	type: text('type').$type<ResetRequestType>().notNull(),
	token: text('token').unique().notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	consumedAt: integer('consumed_at', { mode: 'timestamp' }),
})
