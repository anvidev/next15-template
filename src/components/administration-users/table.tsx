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
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { formatDate, getInitials } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { DataTableDynamicToolbar } from "../data-table/data-table-dynamic-toolbar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { updateRoleAction, updateStatusAction } from "@/actions/auth"
import { Loader } from "../common/loader"
import { emitCustomEvent } from "react-custom-events"
import { useTranslations } from "next-intl"

interface Props {
	user: User
	promise: Promise<Awaited<ReturnType<typeof authService.listUsers>>>
}

export function Table({ promise, user }: Props) {
	const { users, pageCount } = React.use(promise)
	const t = useTranslations("usersPage")

	const columns = createColumns<User>(c => [
		c.display({
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label={t("usersTable.selectAll")}
					className="translate-y-0.5"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label={t("usersTable.selectOne")}
					className="translate-y-0.5"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		}),
		c.accessor('name', {
			id: 'name',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("usersTable.name.title")} />
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
				label: t("usersTable.name.title"),
				placeholder: t("usersTable.name.placeholder"),
				variant: "text",
				icon: Icons.type,
			},
			enableColumnFilter: true,
		}),
		c.accessor('email', {
			id: 'email',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("usersTable.email.title")} />
			),
			meta: {
				label: t("usersTable.email.title"),
				placeholder: t("usersTable.email.placeholder"),
				variant: "text",
				icon: Icons.type,
			},
			enableColumnFilter: true,
		}),
		c.accessor('role', {
			id: 'role',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("usersTable.role.title")} />
			),
			cell: ({ getValue }) => getValue().charAt(0).toUpperCase() + getValue().slice(1),
			meta: {
				label: t("usersTable.role.title"),
				placeholder: t("usersTable.role.placeholder"),
				icon: Icons.list,
				variant: 'multiSelect',
				options: roles.map(r => ({
					label: r.charAt(0).toUpperCase() + r.slice(1),
					value: r,
				}))
			},
			enableColumnFilter: true,
		}),
		c.accessor('emailVerified', {
			id: "emailVerified",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("usersTable.emailVerified.title")} />
			),
			cell: ({ cell }) => {
				const emailVerifed = cell.row.original.emailVerified
				return (
					<Badge variant="outline" className="py-1 [&>svg]:size-3.5">
						{emailVerifed ? <Icons.check className="text-success" /> : <Icons.cross className="text-destructive" />}
						<span className="capitalize">
							{emailVerifed
								? t("usersTable.emailVerified.optionOne")
								: t("usersTable.emailVerified.optionTwo")}
						</span>
					</Badge>
				);
			},
			meta: {
				label: t("usersTable.emailVerified.title"),
				placeholder: t("usersTable.emailVerified.placeholder"),
				variant: "select",
				options: [
					{ label: t("usersTable.emailVerified.optionOne"), value: String(true), icon: Icons.check },
					{ label: t("usersTable.emailVerified.optionTwo"), value: String(false), icon: Icons.cross },
				],
				icon: Icons.list,
			},
			enableColumnFilter: true,
		}),
		c.accessor('active', {
			id: "active",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("usersTable.active.title")} />
			),
			cell: ({ cell }) => {
				const active = cell.row.original.active
				return (
					<Badge variant="outline" className="py-1 [&>svg]:size-3.5">
						{active ? <Icons.check className="text-success" /> : <Icons.cross className="text-destructive" />}
						<span className="capitalize">
							{active
								? t("usersTable.active.optionOne")
								: t("usersTable.active.optionTwo")}
						</span>
					</Badge>
				);
			},
			meta: {
				label: t("usersTable.active.title"),
				placeholder: t("usersTable.active.placeholder"),
				variant: "select",
				options: [
					{ label: t("usersTable.active.optionOne"), value: String(true), icon: Icons.check },
					{ label: t("usersTable.active.optionTwo"), value: String(false), icon: Icons.cross },
				],
				icon: Icons.list,
			},
			enableColumnFilter: true,
		}),
		c.accessor('createdAt', {
			id: 'createdAt',
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title={t("usersTable.createdAt.title")} />
			),
			cell: ({ getValue }) => formatDate(getValue()),
			meta: {
				label: t("usersTable.createdAt.title"),
				placeholder: t("usersTable.createdAt.placeholder"),
				icon: Icons.calendar,
				variant: 'dateRange',
			},
			enableColumnFilter: true,
		}),
		c.display({
			id: "actions",
			cell: function Cell({ row }) {
				const [pending, startUpdateTransition] = React.useTransition();

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								aria-label="Open menu"
								variant="ghost"
								disabled={pending || row.original.id === user.id}
								className="flex size-8 p-0 data-[state=open]:bg-muted ml-auto"
							>
								{pending ? (
									<Loader />
								) : (
									<Icons.ellipsis className="size-4" aria-hidden="true" />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem>
								Edit
							</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>{t("usersTable.role.title")}</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuRadioGroup
										value={row.original.role}
										onValueChange={(value) => {
											startUpdateTransition(() => {
												const { original } = row
												toast.promise(
													updateRoleAction({ ids: [row.original.id], role: value as Role }),
													{
														loading: t("usersTable.role.loadingPromise", { name: original.name }),
														success: t("usersTable.role.successPromise", { name: original.name }),
														error: t("usersTable.role.errorPromise", { name: original.name })
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
												disabled={pending}
											>
												{label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>{t("usersTable.active.title")}</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuRadioGroup
										value={row.original.active.toString()}
										onValueChange={(value) => {
											startUpdateTransition(() => {
												const { original } = row
												toast.promise(
													updateStatusAction({ ids: [row.original.id], active: value === "true" }),
													{
														loading: t("usersTable.active.loadingPromise", { name: original.name }),
														success: t("usersTable.active.successPromise", { name: original.name }),
														error: t("usersTable.active.errorPromise", { name: original.name })
													},
												);
											});
										}}
									>
										<DropdownMenuRadioItem
											value="true"
											className="capitalize"
											disabled={pending}
										>
											{t("usersTable.active.promiseOptionOne")}
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem
											value="false"
											className="capitalize"
											disabled={pending}
										>
											{t("usersTable.active.promiseOptionTwo")}
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuSeparator />
							<DropdownMenuItem
							// onSelect={() => emitCustomEvent('delete-users-dialog', [row])}
							>
								{t("usersTable.resetPinAction")}
							</DropdownMenuItem>
							<DropdownMenuItem
							// onSelect={() => emitCustomEvent('delete-users-dialog', [row])}
							>
								{t("usersTable.resetPasswordAction")}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={() => emitCustomEvent('delete-users-dialog', [row])}
							>
								{t("usersTable.deleteAction")}
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
