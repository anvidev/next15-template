'use server'

import { publicAction } from '@/lib/safe-action'
import { sleep } from '@/lib/utils'
import { getServerSchema } from '@/lib/validations'
import { authService } from '@/service/auth/service'
import { SessionPlatform } from '@/store/auth/models'
import {
	signInValidation,
	signUpValidation,
	verifyValidation,
} from '@/store/auth/validations'
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
		await authService.registerTenant(parsedInput)
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
		await authService.setSessionCookie(newSession.token)
	})

async function getVerifySchema() {
	return await getServerSchema(verifyValidation, 'validation')
}

export const verifyAction = publicAction
	.metadata({ actionName: 'verifyAction' })
	.inputSchema(getVerifySchema)
	.action(async ({ parsedInput }) => {
		const { token } = parsedInput
		await sleep(3000)
		const verification = await authService.confirmVerification(token)
		const newSession = await authService.createSession(
			verification.userId,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})
