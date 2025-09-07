"use client";

import type { Column, Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";

import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableSliderFilter } from "@/components/data-table/data-table-slider-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icons } from "../common/icons";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
	children,
	className,
	...props
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

	const columns = table.getAllColumns().filter((column) => column.getCanFilter())

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

				{columns.map((column) => (
					<DataTableToolbarFilter key={column.id} column={column} />
				))}
				{isFiltered && (
					<Button
						aria-label="Reset filters"
						variant="outline"
						size="sm"
						className="border-dashed"
						onClick={onReset}
					>
						<X />
						Reset
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				{children}
				<DataTableViewOptions table={table} />
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
