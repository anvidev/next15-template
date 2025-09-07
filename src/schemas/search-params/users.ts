import { getSortingStateParser } from '@/lib/date-table/parsers'
import { rolesSchema, User } from '@/store/auth/models'
import {
	createLoader,
	parseAsArrayOf,
	parseAsBoolean,
	parseAsInteger,
	parseAsString,
	parseAsTimestamp,
} from 'nuqs/server'

export const usersSearchParams = {
	q: parseAsString.withDefault(''),
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	sort: getSortingStateParser<User>().withDefault([
		{ id: 'createdAt', desc: true },
	]),
	name: parseAsString.withDefault(''),
	email: parseAsString.withDefault(''),
	emailVerified: parseAsBoolean,
	role: parseAsArrayOf(rolesSchema),
	createdAt: parseAsArrayOf(parseAsTimestamp),
}

export const loadUsersSearchParams = createLoader(usersSearchParams)
