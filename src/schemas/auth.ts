import { TFunc } from '@/i18n/types'
import { getSortingStateParser } from '@/lib/date-table/parsers'
import { Role, rolesSchema, User } from '@/store/auth/models'
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
		email: z.email({ error: t('validations.email') }),
		password: z
			.string({ error: t('validations.required') })
			.min(8, { error: t('validations.min', { number: 8 }) }),
	})
}
export type SignInInput = z.infer<ReturnType<typeof signInValidation>>

export function signUpValidation(t: TFunc) {
	return z.object({
		organizationName: z.string({ error: t('validations.required') }),
		name: z.string({ error: t('validations.required') }),
		email: z.email({ error: t('validations.email') }),
		password: z
			.string({ error: t('validations.required') })
			.min(8, { error: t('validations.min', { number: 8 }) }),
	})
}
export type SignUpInput = z.infer<ReturnType<typeof signUpValidation>>

export function verifyValidation(t: TFunc) {
	return z.object({
		token: z.string({ error: t('validations.required') }),
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
	role: parseAsArrayOf(rolesSchema),
	createdAt: parseAsArrayOf(parseAsTimestamp),
}

export const loadUsersSearchParams = createLoader(usersSearchParams)
export type ListUsersFilters = Awaited<ReturnType<typeof loadUsersSearchParams>>

export function updateUserRoleValidation(t: TFunc) {
	return z.object({
		userId: z.string({ error: t('validations.required') }),
		role: z.enum(Role, { error: t('validations.invalid') }),
	})
}
export type UpdateUserRoleInput = z.infer<
	ReturnType<typeof updateUserRoleValidation>
>

export function deleteUserValidation(t: TFunc) {
	return z.object({
		ids: z.array(z.string({ error: t('validations.required') })),
	})
}
export type DeleteUserInput = z.infer<ReturnType<typeof deleteUserValidation>>

export function inviteUsersValidation(t: TFunc) {
	return z.object({
		emails: z.array(z.email({ error: t('validations.email') })),
		expiresInDays: z.number({ error: t('validations.invalid') }),
		role: z.enum(Role, { error: t('validations.enum') }),
	})
}
export type InviteUsersInput = z.infer<ReturnType<typeof inviteUsersValidation>>
