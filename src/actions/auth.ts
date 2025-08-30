'use server'

import { auth } from '@/lib/auth'
import { publicAction } from '@/lib/safe-action'
import { signInValidation, signUpValidation } from '@/schemas/auth'
import { getServerSchema } from '@/schemas/utils'
import { flattenValidationErrors } from 'next-safe-action'

async function getSignUpSchema() {
	return getServerSchema(signUpValidation, 'validation')
}

export const signUpAction = publicAction
	.metadata({ actionName: 'signInAction' })
	.inputSchema(getSignUpSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const { organizationName, name, email, password } = parsedInput
		await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
			},
		})
	})

async function getSignInSchema() {
	return await getServerSchema(signInValidation, 'validation')
}

export const signInAction = publicAction
	.metadata({ actionName: 'signInAction' })
	.inputSchema(getSignInSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput: { email, password } }) => {
		await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		})
	})
