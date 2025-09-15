'use server'

import { adminAction, authedAction, publicAction } from '@/lib/safe-action'
import { getServerSchema } from '@/lib/validations'
import {
	acceptAndRegisterValidation,
	changePasswordValidation,
	changePinValidation,
	createPasswordValidation,
	createPinValidation,
	deleteUserValidation,
	inviteUsersValidation,
	resetPinValidation,
	signInPasswordValidation,
	signUpValidation,
	updateProfileValidation,
	updateUserRoleValidation,
	updateUserStatusValidation,
	verifyValidation,
} from '@/schemas/auth'
import { authService } from '@/service/auth/service'
import { SessionPlatform } from '@/store/auth/models'
import { flattenValidationErrors } from 'next-safe-action'
import { revalidatePath } from 'next/cache'

async function getSignUpSchema() {
	return getServerSchema(signUpValidation, 'validations')
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
	return await getServerSchema(signInPasswordValidation, 'validations')
}

export const signInAction = publicAction
	.metadata({ actionName: 'signInAction' })
	.inputSchema(getSignInSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput }) => {
		const { email, password } = parsedInput
		const authorized = await authService.authorizeCredentials(email, password)
		const newSession = await authService.createSession(
			authorized.id,
			SessionPlatform.Web,
		)
		await authService.setSessionCookie(newSession.token)
	})

async function getVerifySchema() {
	return await getServerSchema(verifyValidation, 'validations')
}

export const verifyAction = publicAction
	.metadata({ actionName: 'verifyAction' })
	.inputSchema(getVerifySchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
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
	return await getServerSchema(updateUserRoleValidation, 'validations')
}

export const updateRoleAction = adminAction
	.metadata({ actionName: 'updateRoleAction' })
	.inputSchema(getUpdateRoleSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, tenant, locale } = ctx
		const { ids, role } = parsedInput
		for (const id of ids) {
			if (id === user.id) continue
			await authService.updateUserRole(id, tenant.id, role)
		}
		revalidatePath(`/${locale}/administration/users`)
	})

async function getDeleteUserSchema() {
	return await getServerSchema(deleteUserValidation, 'validations')
}

export const deleteUsersAction = adminAction
	.metadata({ actionName: 'deleteUsersAction' })
	.inputSchema(getDeleteUserSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
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
	return await getServerSchema(inviteUsersValidation, 'validations')
}

export const inviteUsersAction = adminAction
	.metadata({ actionName: 'inviteUsersAction' })
	.inputSchema(getInviteUsersSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
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
	return await getServerSchema(acceptAndRegisterValidation, 'validations')
}

export const acceptInviteAction = publicAction
	.metadata({ actionName: 'acceptInviteAction' })
	.inputSchema(getAcceptInviteSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
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

async function getUpdateStatusSchema() {
	return await getServerSchema(updateUserStatusValidation, 'validations')
}

export const updateStatusAction = adminAction
	.metadata({ actionName: 'updateStatusAction' })
	.inputSchema(getUpdateStatusSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, tenant, locale } = ctx
		const { ids, active } = parsedInput
		for (const id of ids) {
			if (user.id === id) continue
			await authService.updateUserStatus(id, tenant.id, active)
		}
		revalidatePath(`/${locale}/administration/users`)
	})

async function getCreatePinSchema() {
	return await getServerSchema(createPinValidation, 'validations')
}

export const createPinAction = authedAction
	.metadata({ actionName: 'createPinAction' })
	.inputSchema(getCreatePinSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, locale } = ctx
		const { pin } = parsedInput
		await authService.createPin(user.id, pin)
		revalidatePath(`/${locale}/account`)
	})

export const deleteOwnUserAction = authedAction
	.metadata({ actionName: 'deleteOwnUserAction' })
	.action(async ({ ctx }) => {
		const { user, tenant } = ctx
		await authService.deleteUser(user.id, tenant.id)
	})

async function getUpdateOwnProfileSchema() {
	return await getServerSchema(updateProfileValidation, 'validations')
}

export const updateOwnProfileAction = authedAction
	.metadata({ actionName: 'updateOwnProfileAction' })
	.inputSchema(getUpdateOwnProfileSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { name, image } = parsedInput
		const { user, tenant, locale } = ctx
		await authService.updateUserProfile(user.id, tenant.id, {
			name,
			image: image == '' ? null : image,
		})
		revalidatePath(`/${locale}/account`)
	})

async function getResetPinSchema() {
	return await getServerSchema(resetPinValidation, 'validations')
}

export const resetPinAction = publicAction
	.metadata({ actionName: 'resetPinAction' })
	.inputSchema(getResetPinSchema)
	.action(async ({ parsedInput }) => {
		const { token, pin } = parsedInput
	})

async function getChangePinSchema() {
	return await getServerSchema(changePinValidation, 'validations')
}

export const changeOwnPinAction = authedAction
	.metadata({ actionName: 'changeOwnPinAction' })
	.inputSchema(getChangePinSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { currentPin, newPin } = parsedInput
		const { user, locale } = ctx
		await authService.authorizePin(user.email, currentPin)
		await authService.updatePin(user.id, newPin)
		revalidatePath(`/${locale}/account`)
	})

async function getChangeOwnPasswordSchema() {
	return await getServerSchema(changePasswordValidation, 'validations')
}

export const changeOwnPasswordAction = authedAction
	.metadata({ actionName: 'changeOwnPasswordAction' })
	.inputSchema(getChangeOwnPasswordSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { currentPassword, newPassword } = parsedInput
		const { user, locale } = ctx
		await authService.authorizeCredentials(user.email, currentPassword)
		await authService.updatePassword(user.id, newPassword)
		revalidatePath(`/${locale}/account`)
	})

async function getCreatePasswordSchema() {
	return await getServerSchema(createPasswordValidation, 'validations')
}

export const createPasswordAction = authedAction
	.metadata({ actionName: 'createPasswordAction' })
	.inputSchema(getCreatePasswordSchema, {
		handleValidationErrorsShape: async ve =>
			flattenValidationErrors(ve).fieldErrors,
	})
	.action(async ({ parsedInput, ctx }) => {
		const { user, locale } = ctx
		const { password } = parsedInput
		await authService.createPassword(user.id, password)
		revalidatePath(`/${locale}/account`)
	})
