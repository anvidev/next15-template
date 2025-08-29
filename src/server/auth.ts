'use server'

import { auth } from '@/lib/auth'

export async function signUp() {
	await auth.api.signUpEmail({
		body: {
			name: 'anvi',
			email: 'user@email.com',
			password: 'password',
		},
	})
}

export async function signIn() {
	await auth.api.signInEmail({
		body: {
			email: 'user@email.com',
			password: 'password',
		},
	})
}
