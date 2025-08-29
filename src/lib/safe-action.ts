import {
	createSafeActionClient,
	DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import z from 'zod'

class ApplicationError extends Error {}

export const baseActionClient = createSafeActionClient({
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		})
	},
	handleServerError(err, utils) {
		const { ctx, metadata, clientInput } = utils

		console.error({
			message: 'Action error',
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
