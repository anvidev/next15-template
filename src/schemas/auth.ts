import { TFunc } from '@/i18n/types'
import { getSortingStateParser } from '@/lib/date-table/parsers'
import { Role, rolesSchema, User, VerificationType } from '@/store/auth/models'
import {
	createLoader,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsTimestamp,
} from 'nuqs/server'
import z from 'zod'

export function signInValidation(t: TFunc) {
	return z.object({
		email: z.email({ error: t('email') }),
		password: z
			.string({ error: t('required') })
			.min(8, { error: t('min', { number: 8 }) }),
	})
}
export type SignInInput = z.infer<ReturnType<typeof signInValidation>>

export function signUpValidation(t: TFunc) {
	return z.object({
		organizationName: z.string({ error: t('required') }),
		name: z.string({ error: t('required') }),
		email: z.email({ error: t('email') }),
		password: z
			.string({ error: t('required') })
			.min(8, { error: t('min', { number: 8 }) }),
	})
}
export type SignUpInput = z.infer<ReturnType<typeof signUpValidation>>

export function verifyValidation(t: TFunc) {
	return z.object({
		token: z.string({ error: t('required') }),
	})
}
export type verifyInput = z.infer<ReturnType<typeof verifyValidation>>

export const usersSearchParams = {
	q: parseAsString.withDefault(''),
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<User>().withDefault([
		{ id: 'createdAt', desc: true },
	]),
	name: parseAsString.withDefault(''),
	email: parseAsString.withDefault(''),
	emailVerified: parseAsBoolean,
	active: parseAsBoolean,
	role: parseAsArrayOf(rolesSchema),
	createdAt: parseAsArrayOf(parseAsTimestamp),
}

export const loadUsersSearchParams = createLoader(usersSearchParams)
export type ListUsersFilters = Awaited<ReturnType<typeof loadUsersSearchParams>>

export function updateUserRoleValidation(t: TFunc) {
	return z.object({
		ids: z.array(z.string({ error: t('required') })).min(1),
		role: z.enum(Role, { error: t('invalid') }),
	})
}
export type UpdateUserRoleInput = z.infer<
	ReturnType<typeof updateUserRoleValidation>
>

export function deleteUserValidation(t: TFunc) {
	return z.object({
		ids: z.array(z.string({ error: t('required') })),
	})
}
export type DeleteUserInput = z.infer<ReturnType<typeof deleteUserValidation>>

export function inviteUsersValidation(t: TFunc) {
	return z.object({
		invitations: z
			.array(
				z.object({
					email: z.email({ error: t('email') }),
				}),
			)
			.min(1)
			.max(10),
		expiresInDays: z.transform(Number).pipe(z.number({ error: t('invalid') })),
		role: z.enum(Role, { error: t('enum') }),
	})
}
export type InviteUsersInput = z.infer<ReturnType<typeof inviteUsersValidation>>

export function acceptAndRegisterValidation(t: TFunc) {
	return z.object({
		token: z.string({ error: t('required') }),
		name: z.string({ error: t('required') }),
		email: z.email({ error: t('email') }),
		password: z
			.string({ error: t('required') })
			.min(8, { error: t('min', { number: 8 }) }),
	})
}

export function updateUserStatusValidation(t: TFunc) {
	return z.object({
		ids: z.array(z.string({ error: t('required') })).min(1),
		active: z.coerce.boolean({ error: t('boolean') }),
	})
}
export type UpdateUserStatusInput = z.infer<
	ReturnType<typeof updateUserStatusValidation>
>

export function createPinValidation(t: TFunc) {
	return z.object({
		pin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
	})
}

export type CreatePinInput = z.infer<ReturnType<typeof createPinValidation>>

export function createVerificationValidation(t: TFunc) {
	return z.object({
		type: z.enum(VerificationType, { error: t('enum') }),
	})
}

export type CreateVerificationInput = z.infer<
	ReturnType<typeof createVerificationValidation>
>

export function updateProfileValidation(t: TFunc) {
	return z.object({
		name: z.string({ error: t('required') }),
		image: z.union([z.literal(''), z.url()]),
	})
}

export type UpdateProfileInput = z.infer<
	ReturnType<typeof updateProfileValidation>
>

export function resetPinValidation(t: TFunc) {
	return z.object({
		token: z.string({ error: t('required') }),
		pin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
	})
}

export type ResetPinInput = z.infer<ReturnType<typeof resetPinValidation>>
