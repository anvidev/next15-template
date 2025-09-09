"use client"

import { authService } from "@/service/auth/service"
import { DataTable } from "@/components/data-table/data-table"
import * as React from "react"
import { Role, roles, User } from "@/store/auth/models"
import { Icons } from "../common/icons"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableColumnHeader } from "../data-table/data-table-column-header"
import { createColumns } from "@/lib/date-table/columns"
import { Checkbox } from "../ui/checkbox"
import { UsersTableActionBar } from "./table-action-bar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { formatDate, getInitials, sleep } from "@/lib/utils"
import { DataTableRowAction } from "@/lib/date-table/types"
import { Badge } from "../ui/badge"
import { DataTableDynamicToolbar } from "../data-table/data-table-dynamic-toolbar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { updateRoleAction } from "@/actions/auth"
import { Loader } from "../common/loader"
import { emitCustomEvent } from "react-custom-events"

interface Props {
	promise: Promise<Awaited<ReturnType<typeof authService.listUsers>>>
}

export function Table({ promise }: Props) {
	const { users, pageCount } = React.use(promise)

	const columns = createColumns<User>((c, _t) => [
		c.display({
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		}),
		c.accessor('name', {
			id: 'name',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Name" />
			),
			cell: ({ row }) => (
				<div className="flex items-center gap-2">
					<Avatar className='size-7 rounded-md'>
						<AvatarImage
							src={row.original.image || undefined}
							alt={row.original.name}
						/>
						<AvatarFallback className='rounded-md text-xs font-medium uppercase'>{getInitials(row.original.name)}</AvatarFallback>
					</Avatar>
					<p>{row.original.name}</p>
				</div>
			),
			meta: {
				label: "Name",
				placeholder: "Search names...",
				variant: "text",
				icon: Icons.type,
			},
			enableColumnFilter: true,
		}),
		c.accessor('email', {
			id: 'email',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Email" />
			),
			meta: {
				label: "Email",
				placeholder: "Search email...",
				variant: "text",
				icon: Icons.type,
			},
			enableColumnFilter: true,
		}),
		c.accessor('emailVerified', {
			id: "emailVerified",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Verified" />
			),
			cell: ({ cell }) => {
				const emailVerifed = cell.row.original.emailVerified
				return (
					<Badge variant="outline" className="py-1 [&>svg]:size-3.5">
						{emailVerifed ? <Icons.check className="text-success" /> : <Icons.cross className="text-destructive" />}
						<span className="capitalize">{emailVerifed ? 'Verified' : 'Not verified'}</span>
					</Badge>
				);
			},
			meta: {
				label: "Verified",
				variant: "select",
				options: [
					{ label: 'Verified', value: String(true), icon: Icons.check },
					{ label: 'Not verified', value: String(false), icon: Icons.cross },
				],
				icon: Icons.list,
			},
			enableColumnFilter: true,
		}),
		c.accessor('role', {
			id: 'role',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Role" />
			),
			cell: ({ getValue }) => getValue().charAt(0).toUpperCase() + getValue().slice(1),
			meta: {
				label: 'Role',
				icon: Icons.list,
				variant: 'multiSelect',
				placeholder: 'Choose roles',
				options: roles.map(r => ({
					label: r.charAt(0).toUpperCase() + r.slice(1),
					value: r,
				}))
			},
			enableColumnFilter: true,
		}),
		c.accessor('createdAt', {
			id: 'createdAt',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created" />
			),
			cell: ({ getValue }) => formatDate(getValue()),
			meta: {
				label: 'Created',
				icon: Icons.calendar,
				variant: 'dateRange',
				placeholder: 'Choose dates',
			},
			enableColumnFilter: true,
		}),
		c.display({
			id: "actions",
			cell: function Cell({ row }) {
				const [isUpdatePending, startUpdateTransition] = React.useTransition();
				const [rowAction, setRowAction] =
					React.useState<DataTableRowAction<User> | null>(null);

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label="Open menu"
								variant="ghost"
								disabled={isUpdatePending}
								className="flex size-8 p-0 data-[state=open]:bg-muted ml-auto"
							>
								{isUpdatePending ? (
									<Loader />
								) : (
									<Icons.ellipsis className="size-4" aria-hidden="true" />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								onSelect={() => setRowAction({ row, variant: "update" })}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuRadioGroup
										value={row.original.role}
										onValueChange={(value) => {
											startUpdateTransition(() => {
												toast.promise(
													updateRoleAction({ userId: row.original.id, role: value as Role }),
													{
														loading: "Updating...",
														success: "Label updated",
														error: (err) => "get error message"
													},
												);
											});
										}}
									>
										{roles.map((label) => (
											<DropdownMenuRadioItem
												key={label}
												value={label}
												className="capitalize"
												disabled={isUpdatePending}
											>
												{label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								// would open a delte dialog
								onSelect={() => emitCustomEvent('delete-users-dialog', [row])}
							>
								Delete
								<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
			size: 40,
		})
	])

	const { table } = useDataTable({
		data: users,
		columns,
		pageCount,
		getRowId: orignial => orignial.id,
		clearOnDefault: true,
		shallow: false,
		enableGlobalFilter: true,
		initialState: {
			sorting: [
				{ id: 'createdAt', desc: true },
			]
		}
	})

	return (
		<DataTable
			table={table}
			actionBar={<UsersTableActionBar table={table} />}
		>
			<DataTableDynamicToolbar
				table={table}
				showViewOptions
				showExportTable
			/>
		</DataTable>
	)
}
