'use server'

import { ApplicationError, publicAction } from '@/lib/safe-action'
import { tryCatch } from '@/lib/try-catch'
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
		const newTenant = await tryCatch(authService.registerTenant(parsedInput))
		if (!newTenant.success) {
			throw new ApplicationError(newTenant.error.message)
		}

		// TOOD: send verification mail to admin user later

		const newSession = await tryCatch(
			authService.createSession(newTenant.data.user.id, SessionPlatform.Web),
		)
		if (!newSession.success) {
			throw new ApplicationError(newSession.error.message)
		}

		const setCookie = await tryCatch(
			authService.setSessionCookie(newSession.data.token),
		)
		if (!setCookie.success) {
			throw new ApplicationError(setCookie.error.message)
		}
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
		const authorized = await tryCatch(authService.authorizeCredentials(parsedInput))
		if (!authorized.success) {
			throw new ApplicationError(authorized.error.message)
		}

		const newSession = await tryCatch(
			authService.createSession(authorized.data.id, SessionPlatform.Web),
		)
		if (!newSession.success) {
			throw new ApplicationError(newSession.error.message)
		}

		const setCookie = await tryCatch(
			authService.setSessionCookie(newSession.data.token),
		)
		if (!setCookie.success) {
			throw new ApplicationError(setCookie.error.message)
		}
	})
