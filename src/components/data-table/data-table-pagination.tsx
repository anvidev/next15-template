import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DataTablePaginationProps<TData> extends React.ComponentProps<"div"> {
	table: Table<TData>;
	pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = [10, 20, 30, 40, 50],
	className,
	...props
}: DataTablePaginationProps<TData>) {
	const t = useTranslations("data-table")
	return (
		<div
			className={cn(
				"flex w-full items-center justify-between gap-4 overflow-auto sm:flex-row sm:gap-8",
				className,
			)}
			{...props}
		>
			<div className="flex-1 whitespace-nowrap text-muted-foreground text-sm hidden md:block">
				{t("selectedRows", {
					count: table.getFilteredSelectedRowModel().rows.length,
					total: table.getFilteredRowModel().rows.length,
				})}
			</div>
			<div className="flex flex-row justify-between md:justify-end items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8 w-full">
				<div className="flex items-center space-x-2">
					<p className="whitespace-nowrap font-medium text-sm hidden md:block text-muted-foreground">
						{t("rowsPerPage")}
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[4.5rem] [&[data-size]]:h-8">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{pageSizeOptions.map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<div className="flex items-center justify-center font-medium text-xs md:text-sm text-muted-foreground">
						{t("pageOfPage", {
							currentPage: table.getState().pagination.pageIndex + 1,
							totalPages: table.getPageCount(),
						})}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							aria-label="Go to first page"
							variant="outline"
							size="icon"
							className="hidden size-8 lg:flex"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronsLeft />
						</Button>
						<Button
							aria-label="Go to previous page"
							variant="outline"
							size="icon"
							className="size-8"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronLeft />
						</Button>
						<Button
							aria-label="Go to next page"
							variant="outline"
							size="icon"
							className="size-8"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<ChevronRight />
						</Button>
						<Button
							aria-label="Go to last page"
							variant="outline"
							size="icon"
							className="hidden size-8 lg:flex"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
