import { TFunc } from '@/i18n/types'
import { StandardSchemaV1 } from '@t3-oss/env-core'
import { getTranslations } from 'next-intl/server'

type SchemaGetter<I, O> = (t: TFunc) => StandardSchemaV1<I, O>

/**
 * Function `getServerSchema` is a helper function for using the same schema
 * with localized error messages in server actions.
 *
 * @param schemaGetter {SchemaGetter} - schema functions defined in `schemas` folder
 * @param namespace {string} - key of message object in locale json file
 *
 * @expample
 * 	export const signInAction = publicAction
 * 		.metadata({ actionName: 'signInAction' })
 * 		.inputSchema(await getServerSchema(signInValidation, 'validation'))
 * 		.action(async ({ parsedInput: { email, password } }) => {
 * 			await auth.api.signInEmail({
 * 				body: {
 * 					email,
 * 					password,
 * 				},
 * 			})
 * 		})
 */
export async function getServerSchema<I, O>(
	schemaGetter: SchemaGetter<I, O>,
	namespace?: string,
) {
	const t = await getTranslations(namespace)
	return schemaGetter(t)
}
