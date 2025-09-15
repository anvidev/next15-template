import { TFunc } from '@/i18n/types'
import { getSortingStateParser } from '@/lib/date-table/parsers'
import { ResetRequestType, Role, User } from '@/store/auth/models'
import {
	createLoader,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsTimestamp,
} from 'nuqs/server'
import z from 'zod'

export function signInPasswordValidation(t: TFunc) {
	return z.object({
		email: z.email({ error: t('email') }),
		password: z
			.string({ error: t('required') })
			.min(8, { error: t('min', { number: 8 }) }),
	})
}

export function signInPinValidation(t: TFunc) {
	return z.object({
		email: z.email({ error: t('email') }),
		pin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
	})
}

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
	role: parseAsArrayOf(z.enum(Role)),
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

export function deleteUserValidation(t: TFunc) {
	return z.object({
		ids: z.array(z.string({ error: t('required') })),
	})
}

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

export function createPinValidation(t: TFunc) {
	return z.object({
		pin: z.transform(Number).pipe(z.coerce.number({ error: t('invalid') })),
	})
}

export function updateProfileValidation(t: TFunc) {
	return z.object({
		name: z.string({ error: t('required') }),
		image: z.union([z.literal(''), z.url()]),
	})
}

export function resetPinValidation(t: TFunc) {
	return z.object({
		token: z.string({ error: t('required') }),
		pin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
	})
}

export function changePinValidation(t: TFunc) {
	return z
		.object({
			currentPin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
			newPin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
			confirmPin: z.transform(Number).pipe(z.number({ error: t('invalid') })),
		})
		.superRefine((val, ctx) => {
			const PIN_LENGTH = 4
			if (val.currentPin.toString().length !== PIN_LENGTH) {
				ctx.addIssue({
					code: 'custom',
					message: t('length', { number: PIN_LENGTH }),
					input: val,
					path: ['currentPin'],
				})
			}
			if (val.newPin.toString().length !== PIN_LENGTH) {
				ctx.addIssue({
					code: 'custom',
					message: t('length', { number: PIN_LENGTH }),
					input: val,
					path: ['newPin'],
				})
			}
			if (val.confirmPin.toString().length !== PIN_LENGTH) {
				ctx.addIssue({
					code: 'custom',
					message: t('length', { number: PIN_LENGTH }),
					input: val,
					path: ['confirmPin'],
				})
			}
			if (val.newPin !== val.confirmPin) {
				ctx.addIssue({
					code: 'custom',
					message: t('pinCodeMismatch'),
					input: val,
					path: ['confirmPin'],
				})
			}
			if (val.newPin === val.currentPin) {
				ctx.addIssue({
					code: 'custom',
					message: t('pinCodeSame'),
					input: val,
					path: ['newPin'],
				})
			}
		})
}

export function changePasswordValidation(t: TFunc) {
	return z
		.object({
			currentPassword: z.string({ error: t('required') }),
			newPassword: z
				.string({ error: t('required') })
				.min(8, { error: t('min', { number: 8 }) })
				.max(32, { error: t('max', { number: 32 }) }),
			confirmPassword: z
				.string({ error: t('required') })
				.min(8, { error: t('min', { number: 8 }) })
				.max(32, { error: t('max', { number: 32 }) }),
		})
		.superRefine((val, ctx) => {
			if (val.newPassword !== val.confirmPassword) {
				ctx.addIssue({
					code: 'custom',
					message: t('passwordMismatch'),
					input: val,
					path: ['confirmPassword'],
				})
			}
			if (val.newPassword === val.currentPassword) {
				ctx.addIssue({
					code: 'custom',
					message: t('passwordSame'),
					input: val,
					path: ['newPassword'],
				})
			}
		})
}

export function createPasswordValidation(t: TFunc) {
	return z
		.object({
			password: z
				.string({ error: t('required') })
				.min(8, { error: t('min', { number: 8 }) })
				.max(32, { error: t('max', { number: 32 }) }),
			confirmPassword: z
				.string({ error: t('required') })
				.min(8, { error: t('min', { number: 8 }) })
				.max(32, { error: t('max', { number: 32 }) }),
		})
		.superRefine((val, ctx) => {
			if (val.password !== val.confirmPassword) {
				ctx.addIssue({
					code: 'custom',
					message: t('passwordMismatch'),
					input: val,
					path: ['confirmPassword'],
				})
			}
		})
}

export function changeEmailValidation(t: TFunc) {
	return z.object({
		newEmail: z.email({ error: t('email') }),
	})
}

export function createResetRequestValidation(t: TFunc) {
	return z.object({
		email: z.email({ error: t('email') }),
		type: z.enum(ResetRequestType, { error: t('enum') }),
	})
}

export function sendPinResetRequestValidation(t: TFunc) {
	return z
		.object({
			token: z.string({ error: t('required') }),
			type: z.enum(ResetRequestType, { error: t('enum') }),
			credential: z
				.string({ error: t('required') })
				.min(4, { error: t('min', { number: 4 }) })
				.max(4, { error: t('max', { number: 4 }) }),
			confirmCredential: z
				.string({ error: t('required') })
				.min(4, { error: t('min', { number: 4 }) })
				.max(4, { error: t('max', { number: 4 }) }),
		})
		.superRefine((val, ctx) => {
			if (val.credential !== val.confirmCredential) {
				ctx.addIssue({
					code: 'custom',
					message: t('pinMismatch'),
					input: val,
					path: ['confirmCredential'],
				})
			}
		})
}

export function sendPasswordResetRequestValidation(t: TFunc) {
	return z
		.object({
			token: z.string({ error: t('required') }),
			type: z.enum(ResetRequestType, { error: t('enum') }),
			credential: z
				.string({ error: t('required') })
				.min(8, { error: t('min', { number: 8 }) })
				.max(32, { error: t('max', { number: 32 }) }),
			confirmCredential: z
				.string({ error: t('required') })
				.min(8, { error: t('min', { number: 8 }) })
				.max(32, { error: t('max', { number: 32 }) }),
		})
		.superRefine((val, ctx) => {
			if (val.credential !== val.confirmCredential) {
				ctx.addIssue({
					code: 'custom',
					message: t('passwordMismatch'),
					input: val,
					path: ['confirmCredential'],
				})
			}
		})
}
