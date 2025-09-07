import { ColumnSort, Row, RowData } from '@tanstack/react-table'

const filterVariants = [
	'text',
	'number',
	'range',
	'date',
	'dateRange',
	'boolean',
	'select',
	'multiSelect',
] as const
export type FilterVariant = (typeof filterVariants)[number]

declare module '@tanstack/react-table' {
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string
		placeholder?: string
		variant?: FilterVariant
		options?: Option[]
		range?: [number, number]
		unit?: string
		icon?: React.FC<React.SVGProps<SVGSVGElement>>
	}
}

export interface Option {
	label: string
	value: string
	count?: number
	icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
	id: Extract<keyof TData, string>
}

export interface DataTableRowAction<TData> {
	row: Row<TData>
	variant: 'update' | 'delete'
}
