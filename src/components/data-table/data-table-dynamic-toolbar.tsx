"use client";

import type { Column, Table } from "@tanstack/react-table";
import * as React from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableSliderFilter } from "@/components/data-table/data-table-slider-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icons } from "../common/icons";
import { DataTableExportData } from "./data-table-export-data";
import { useTranslations } from "next-intl";

interface DataTableDynamicToolbarProps<TData> extends React.ComponentProps<"div"> {
	table: Table<TData>;
	showViewOptions?: boolean
	showExportTable?: boolean
}

export function DataTableDynamicToolbar<TData>({
	table,
	showViewOptions = false,
	showExportTable = false,
	children,
	className,
	...props
}: DataTableDynamicToolbarProps<TData>) {
	const t = useTranslations("data-table")
	const [visibleFilters, setVisibleFilters] = React.useState(new Set(table.getState().columnFilters.map(cf => cf.id)))

	const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

	const columns = React.useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table])
	const visibleColums = columns.filter(c => visibleFilters.has(c.id))
	const unfilteredColumns = columns.filter(c => !visibleFilters.has(c.id))

	function addFilter(columnId: string) {
		setVisibleFilters(prev => {
			prev.add(columnId)
			return new Set(prev)
		})
	}

	function removeFilter(columnId: string) {
		columns.find(c => c.id === columnId)?.setFilterValue(undefined)
		setVisibleFilters(prev => {
			prev.delete(columnId)
			return new Set(prev)
		})
	}

	const onReset = React.useCallback(() => {
		table.resetColumnFilters();
		table.resetGlobalFilter()
	}, [table]);

	return (
		<div
			role="toolbar"
			aria-orientation="horizontal"
			className={cn(
				"flex w-full items-start justify-between gap-2",
				className,
			)}
			{...props}
		>
			<div className="flex flex-1 flex-wrap items-center gap-2">
				{table.options.enableGlobalFilter && (
					<GlobalFilter table={table} />
				)}

				{visibleColums.map((column) => (
					<div key={column.id} className="relative group">
						<div
							onClick={() => removeFilter(column.id)}
							className="group-hover:opacity-100 hover:bg-foreground/80 pointer-events-none group-hover:pointer-events-auto opacity-0 transition-all absolute animate-in -translate-y-1/3 right-0 translate-x-1/3 rounded-sm bg-foreground text-background p-0.5">
							<Icons.cross
								className="size-3 stroke-3" />
						</div>
						<DataTableToolbarFilter key={column.id} column={column} />
					</div>
				))}
				{visibleFilters.size < columns.length && (
					<AddFilterButton
						onAdd={addFilter}
						columns={unfilteredColumns} />
				)}
				{isFiltered && (
					<Button
						aria-label="Reset filters"
						variant="outline"
						size="sm"
						className="border-dashed text-sm"
						onClick={onReset}
					>
						<Icons.cross />
						{t("resetFilters")}
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				{children}
				{showExportTable && (
					<DataTableExportData table={table} />
				)}
				{showViewOptions && (
					<DataTableViewOptions table={table} />
				)}
			</div>
		</div>
	);
}
interface DataTableToolbarFilterProps<TData> {
	column: Column<TData>;
}

function DataTableToolbarFilter<TData>({
	column,
}: DataTableToolbarFilterProps<TData>) {
	{
		const columnMeta = column.columnDef.meta;

		const onFilterRender = React.useCallback(() => {
			if (!columnMeta?.variant) return null;

			switch (columnMeta.variant) {
				case "text":
					return (
						<Input
							placeholder={columnMeta.placeholder ?? columnMeta.label}
							value={(column.getFilterValue() as string) ?? ""}
							onChange={(event) => column.setFilterValue(event.target.value)}
							className="h-8 w-36 lg:w-44"
						/>
					);

				case "number":
					return (
						<div className="relative">
							<Input
								type="number"
								inputMode="numeric"
								placeholder={columnMeta.placeholder ?? columnMeta.label}
								value={(column.getFilterValue() as string) ?? ""}
								onChange={(event) => column.setFilterValue(event.target.value)}
								className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
							/>
							{columnMeta.unit && (
								<span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
									{columnMeta.unit}
								</span>
							)}
						</div>
					);

				case "range":
					return (
						<DataTableSliderFilter
							column={column}
							title={columnMeta.label ?? column.id}
						/>
					);

				case "date":
				case "dateRange":
					return (
						<DataTableDateFilter
							column={column}
							title={columnMeta.label ?? column.id}
							multiple={columnMeta.variant === "dateRange"}
						/>
					);

				case "select":
				case "multiSelect":
					return (
						<DataTableFacetedFilter
							column={column}
							title={columnMeta.label ?? column.id}
							options={columnMeta.options ?? []}
							multiple={columnMeta.variant === "multiSelect"}
						/>
					);

				default:
					return null;
			}
		}, [column, columnMeta]);

		return onFilterRender();
	}
}

interface DataTableToolbarGlobalFilterProps<TData> {
	table: Table<TData>;
}

function GlobalFilter<TData>({ table }: DataTableToolbarGlobalFilterProps<TData>) {
	const [isFocused, setIsFocused] = React.useState(false)

	const handleFocus = React.useCallback(() => {
		setIsFocused(true)
	}, [setIsFocused])

	const handleBlur = React.useCallback(() => {
		setIsFocused(false)
	}, [setIsFocused])

	const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		table.setGlobalFilter(value)
	}, [table])

	const hasValue = table.getState().globalFilter
	const isExpanded = isFocused || hasValue

	return (
		<div className='relative'>
			<Icons.search
				className={cn(
					'absolute size-3.5 pointer-events-none transition-all duration-200 ease-in-out',
					'top-1/2 -translate-y-1/2',
					isExpanded
						? 'right-3 translate-x-0 rotate-90 text-muted-foreground'
						: 'right-1/2 translate-x-1/2'
				)}
			/>
			<Input
				type='text'
				placeholder="Search..."
				id='table-searchbar'
				className={cn(
					'transition-all h-8 duration-200 ease-in-out',
					isExpanded
						? 'w-36 lg:w-44 placeholder:opacity-100 cursor-text pr-8'
						: 'w-8 placeholder:opacity-0 cursor-pointer hover:bg-accent',
					hasValue && 'w-fit'
				)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				value={table.getState().globalFilter || ''}
				onChange={handleChange}
				aria-label="Search..."
			/>
		</div>
	)
}

interface DataTableDynamicToolbarAddFilterProps<TData> {
	onAdd: (columnId: string) => void
	columns: Column<TData, unknown>[]
}

function AddFilterButton<TData>({ onAdd, columns }: DataTableDynamicToolbarAddFilterProps<TData>) {
	const t = useTranslations("data-table")
	const [open, setOpen] = React.useState(false)
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="border-dashed text-sm"
				>
					<Icons.plus className="size-3.5" />
					{t("addFilter")}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search filters..." className="h-9" />
					<CommandList>
						<CommandEmpty>No filters found</CommandEmpty>
						<CommandGroup>
							{columns.map((column) => (
								<CommandItem
									key={column.id}
									value={column.id}
									onSelect={(value) => {
										setOpen(false)
										onAdd(value)
									}}
								>
									{column.columnDef.meta?.icon && (
										<column.columnDef.meta.icon />
									)}
									{column.columnDef.meta?.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
