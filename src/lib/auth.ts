import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { db } from './database/connection'
import { schema } from './database/schema/auth'
import { env } from './env'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema: schema,
	}),
	baseURL: env.BETTER_AUTH_URL,
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		minPasswordLength: 8,
		maxPasswordLength: 32,
	},
	plugins: [nextCookies()],
})
