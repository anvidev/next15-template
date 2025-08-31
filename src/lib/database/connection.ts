import { env } from '@/lib/env'
import { createClient, ResultSet } from '@libsql/client'
import 'dotenv/config'
import { ExtractTablesWithRelations } from 'drizzle-orm'
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql'
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core'

const client = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN,
})

export const db = drizzle({ client })

export type Tx =
	| SQLiteTransaction<
			'async',
			ResultSet,
			Record<string, never>,
			ExtractTablesWithRelations<Record<string, never>>
	  >
	| LibSQLDatabase<Record<string, never>>
