'use client'

import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

type ColumnBuilder<T> = ReturnType<typeof createColumnHelper<T>>

export function createColumns<T>(
	builder: (c: ColumnBuilder<T>) => ColumnDef<T, any>[],
): ColumnDef<T, any>[] {
	const c = createColumnHelper<T>()
	return builder(c)
}
