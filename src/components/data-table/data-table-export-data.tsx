"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Icons } from "../common/icons"
import { exportTableToCSV } from "@/lib/export"

interface DataTableExportDataProps<TData> {
	table: Table<TData>
}

export function DataTableExportData<TData>({ table }: DataTableExportDataProps<TData>) {
	return (
		<Button
			aria-label="Toggle columns"
			role="combobox"
			variant="outline"
			size="sm"
			className="ml-auto hidden h-8 lg:flex"
			onClick={() => exportTableToCSV(table)}
		>
			<Icons.download className="size-3.5" />
			Export
		</Button>
	)
}
