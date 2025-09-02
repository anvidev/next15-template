import { TFunc } from '@/i18n/types'
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
