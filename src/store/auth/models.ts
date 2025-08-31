import {
	accountsTable,
	invitationsTable,
	sessionsTable,
	tenantsTable,
	usersTable,
	verificationsTable,
} from '@/lib/database/schema/auth'
import z from 'zod'

export enum AccountProvider {
	Credential = 'credential',
	PIN = 'pin',
}
export const accountProviders = Object.values(AccountProvider)
export const accountProvidersScheme = z.enum(AccountProvider)
export type Account = typeof accountsTable.$inferSelect
export type NewAccount = typeof accountsTable.$inferInsert

export enum Role {
	Administrator = 'admin',
	User = 'user',
}
export const roles = Object.values(Role)
export const rolesSchema = z.enum(Role)
export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert

export enum SessionPlatform {
	Web = 'web',
	App = 'app',
}
export const sessionPlatform = Object.values(SessionPlatform)
export const sessionPlatformSchema = z.enum(SessionPlatform)
export type Session = typeof sessionsTable.$inferSelect
export type NewSession = typeof sessionsTable.$inferInsert

export enum VerificationType {
	Email = 'email',
	Password = 'password',
	PIN = 'pin',
}
export const verificationTypes = Object.values(VerificationType)
export const verificationTypesSchema = z.enum(VerificationType)
export type Verification = typeof verificationsTable.$inferSelect
export type NewVerification = typeof verificationsTable.$inferInsert

export enum InvitationStatus {
	Pending = 'pending',
	Accepted = 'accepted',
	Rejected = 'rejected',
	Cancelled = 'cancalled',
}
export const invitationStatuses = Object.values(InvitationStatus)
export const invitationStatusesSchema = z.enum(InvitationStatus)
export type Invitation = typeof invitationsTable.$inferSelect
export type NewInvitation = typeof invitationsTable.$inferInsert

export type Tenant = typeof tenantsTable.$inferSelect
export type NewTenant = typeof tenantsTable.$inferInsert
