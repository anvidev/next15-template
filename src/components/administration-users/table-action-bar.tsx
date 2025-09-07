"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";
import {
	DataTableActionBar,
	DataTableActionBarAction,
	DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { exportTableToCSV } from "@/lib/export";
import { User } from "@/store/auth/models";
import { Icons } from "../common/icons";

const actions = [
	"update-status",
	"update-priority",
	"export",
	"delete",
] as const;

type Action = (typeof actions)[number];

interface Props {
	table: Table<User>;
}

export function UsersTableActionBar({ table }: Props) {
	const rows = table.getFilteredSelectedRowModel().rows;
	const [isPending, startTransition] = React.useTransition();
	const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

	const getIsActionPending = React.useCallback(
		(action: Action) => isPending && currentAction === action,
		[isPending, currentAction],
	);

	const onTaskExport = React.useCallback(() => {
		setCurrentAction("export");
		startTransition(() => {
			exportTableToCSV(table, {
				excludeColumns: ["select", "actions"],
				onlySelected: true,
			});
		});
	}, [table]);

	return (
		<DataTableActionBar table={table} visible={rows.length > 0}>
			<DataTableActionBarSelection table={table} />
			<Separator
				orientation="vertical"
				className="hidden data-[orientation=vertical]:h-5 sm:block"
			/>
			<div className="flex items-center gap-1.5">
				<DataTableActionBarAction
					size="icon"
					tooltip="Export tasks"
					isPending={getIsActionPending("export")}
					onClick={onTaskExport}
				>
					<Icons.download />
				</DataTableActionBarAction>
			</div>
		</DataTableActionBar>
	);
}
