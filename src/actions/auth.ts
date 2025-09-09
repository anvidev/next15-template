'use server'

import { adminAction, publicAction } from '@/lib/safe-action'
import { getServerSchema } from '@/lib/validations'
import {
	acceptAndRegisterValidation,
	deleteUserValidation,
	inviteUsersValidation,
	signInValidation,
	signUpValidation,
	updateUserRoleValidation,
	verifyValidation,
} from '@/schemas/auth'
import { authService } from '@/service/auth/service'
import { SessionPlatform } from '@/store/auth/models'
import { flattenValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'

async function getSignUpSchema() {
	return getServerSchema(signUpValidation)
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
	return await getServerSchema(signInValidation)
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
	return await getServerSchema(verifyValidation)
}

export const verifyAction = publicAction
	.metadata({ actionName: 'verifyAction' })
	.inputSchema(getVerifySchema)
	.action(async ({ parsedInput }) => {
		const { token } = parsedInput
		const verification = await authService.confirmVerification(token)
		const newSession = await authService.createSession(
			verification.userId,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})

async function getUpdateRoleSchema() {
	return await getServerSchema(updateUserRoleValidation)
}

export const updateRoleAction = adminAction
	.metadata({ actionName: 'updateRoleAction' })
	.inputSchema(getUpdateRoleSchema)
	.action(async ({ parsedInput, ctx }) => {
		const { tenant, locale } = ctx
		const { userId, role } = parsedInput
		await authService.updateUserRole(userId, tenant.id, role)
		revalidatePath(`/${locale}/administration/users`)
	})

async function getDeleteUserSchema() {
	return await getServerSchema(deleteUserValidation)
}

export const deleteUsersAction = adminAction
	.metadata({ actionName: 'deleteUsersAction' })
	.inputSchema(getDeleteUserSchema)
	.action(async ({ parsedInput, ctx }) => {
		const { tenant, user, locale } = ctx
		const { ids } = parsedInput
		for (const id of ids) {
			if (id === user.id) continue
			await authService.deleteUser(id, tenant.id)
		}
		revalidatePath(`/${locale}/administration/users`)
	})

async function getInviteUsersSchema() {
	return await getServerSchema(inviteUsersValidation)
}

export const inviteUsersAction = adminAction
	.metadata({ actionName: 'inviteUsersAction' })
	.inputSchema(getInviteUsersSchema)
	.action(async ({ parsedInput, ctx }) => {
		const { tenant, user, locale } = ctx
		const { invitations, expiresInDays, role } = parsedInput
		const invitationPromises = []
		for (const invitation of invitations) {
			invitationPromises.push(
				authService.createInvitation(
					tenant.id,
					user.id,
					invitation.email,
					role,
					expiresInDays,
				),
			)
		}
		await Promise.all(invitationPromises)
		revalidatePath(`/${locale}/administration/users`)
	})

async function getAcceptInviteSchema() {
	return await getServerSchema(acceptAndRegisterValidation)
}

export const acceptInviteAction = publicAction
	.metadata({ actionName: 'acceptInviteAction' })
	.inputSchema(getAcceptInviteSchema)
	.action(async ({ parsedInput }) => {
		const { token, name, email, password } = parsedInput
		const { user } = await authService.acceptInvitation(
			token,
			name,
			email,
			password,
		)
		const newSession = await authService.createSession(
			user.id,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})
