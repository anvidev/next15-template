import { TFunc } from '@/i18n/types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useTranslations } from 'next-intl'

type ColumnBuilder<T> = ReturnType<typeof createColumnHelper<T>>

export function createColumns<T>(
	builder: (c: ColumnBuilder<T>, t: TFunc) => ColumnDef<T, any>[],
): ColumnDef<T, any>[] {
	const t = useTranslations()
	const c = createColumnHelper<T>()
	return builder(c, t)
}
