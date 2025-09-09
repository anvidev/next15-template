import { authService } from '@/service/auth/service'
import { Role } from '@/store/auth/models'
import { getLocale, getTranslations } from 'next-intl/server'
import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import z from 'zod'

const baseActionClient = createSafeActionClient({
	defaultValidationErrorsShape: 'flattened',
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		})
	},
	handleServerError(err, utils) {
		const { ctx, metadata, clientInput } = utils

		console.error({
			err,
			ctx,
			metadata,
			clientInput,
		})

		if (err instanceof ApplicationError) {
			return err.message
		}

		return DEFAULT_SERVER_ERROR_MESSAGE
	},
})

export const publicAction = baseActionClient
	.use(async ({ next, ctx }) => {
		const t = await getTranslations()
		const locale = await getLocale()

		return next({ ctx: { ...ctx, t, locale } })
	})
	.use(async ({ next, clientInput, metadata }) => {
		const startTime = performance.now()
		const response = await next()
		const endTime = performance.now()

		console.log('Result ->', response)
		console.log('Client input ->', clientInput)
		console.log('Metadata ->', metadata)
		console.log('Action execution took', endTime - startTime, 'ms')

		return response
	})

export const authedAction = publicAction.use(async ({ next, ctx }) => {
	const { session, user, tenant } = await authService.verify()

	if (!session) {
		throw new ApplicationError(
			ctx.t('errors.unauthorized'),
			'Actions: Unauthorized',
		)
	}

	if (!user.active) {
		throw new ApplicationError(
			ctx.t('errors.unauthorized'),
			'Actions: Forbidden',
			{ message: 'User is not active' },
		)
	}

	return next({ ctx: { ...ctx, session, user, tenant } })
})

export const adminAction = authedAction.use(async ({ next, ctx }) => {
	if (ctx.user.role != Role.Administrator) {
		throw new ApplicationError(
			ctx.t('errors.unauthorized'),
			'Actions: Forbidden',
			{ message: 'Not an admin user' },
		)
	}

	return next({ ctx })
})

export class ApplicationError extends Error {
	public readonly code: Code
	public readonly context?: Record<string, any>

	constructor(message: string, code: Code, context?: Record<string, any>) {
		super(message)
		this.name = 'ApplicationError'
		this.code = code
		this.context = context

		if ('captureStackTrace' in Error) {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}

const codes = [
	'Internal Server Error',
	'Not Found',
	'Bad Request',
	'Validation Error',
	'Unauthorized',
	'Forbidden',
	'Conflict',
	'Database Error',
] as const

const layers = ['Store', 'Service', 'Actions', 'Api'] as const

type Code = `${(typeof layers)[number]}: ${(typeof codes)[number]}`
