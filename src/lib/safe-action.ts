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
