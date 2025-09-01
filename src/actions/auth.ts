'use server'

import { publicAction } from '@/lib/safe-action'
import { signInValidation, signUpValidation } from '@/schemas/auth'
import { getServerSchema } from '@/schemas/utils'
import { authService } from '@/service/auth/service'
import { SessionPlatform } from '@/store/auth/models'
import { flattenValidationErrors } from 'next-safe-action'

async function getSignUpSchema() {
	return getServerSchema(signUpValidation, 'validation')
}

export const signUpAction = publicAction
	.metadata({ actionName: 'signUpAction' })
	.inputSchema(getSignUpSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const newTenant = await authService.registerTenant(parsedInput)

		// TOOD: send verification mail to admin user later

		const newSession = await authService.createSession(
			newTenant.user.id,
			SessionPlatform.Web,
		)
		const setCookie = await authService.setSessionCookie(newSession.token)
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
	.action(async ({ parsedInput }) => {
		const authorized = await authService.authorizeCredentials(parsedInput)
		const newSession = await authService.createSession(
			authorized.id,
			SessionPlatform.Web,
		)
		const setCookie = await authService.setSessionCookie(newSession.token)
	})
