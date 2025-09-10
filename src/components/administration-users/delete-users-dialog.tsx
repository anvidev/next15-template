"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useCustomEventListener } from 'react-custom-events'
import { Row } from "@tanstack/react-table";
import { User } from "@/store/auth/models";
import { useAction } from "next-safe-action/hooks";
import { deleteUsersAction } from "@/actions/auth";
import { toast } from "sonner";
import { Loader } from "../common/loader";
import { useTranslations } from "next-intl";

export function DeleteUsersDialog() {
	const isMobile = useIsMobile();
	const [rows, setRows] = useState<Row<User>[]>([])
	const tUsersPage = useTranslations("usersPage")

	const { execute, isExecuting } = useAction(deleteUsersAction, {
		onError() {
			toast(tUsersPage("deleteUsersDialog.errorToast"))
		},
		onSuccess({ input }) {
			toast(tUsersPage("deleteUsersDialog.successToast", { count: input.ids.length }))
			setRows([])
		},
	})

	useCustomEventListener('delete-users-dialog', (data: Row<User>[]) => {
		setRows(data)
	})

	function onOpenChange(_open: boolean) {
		setRows([])
	}

	function deleteUsers() {
		const ids = rows.map(r => r.original.id)
		execute({ ids })
	}

	if (isMobile) {
		<Drawer open={rows.length > 0} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{tUsersPage("deleteUsersDialog.title", { count: rows.length })}</DrawerTitle>
					<DrawerDescription>
						{tUsersPage("deleteUsersDialog.description")}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<DrawerClose asChild>
						<Button variant="outline">{tUsersPage("deleteUsersDialog.cancelButton")}</Button>
					</DrawerClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={deleteUsers}
					>
						{isExecuting && (
							<Loader />
						)}
						{tUsersPage("deleteUsersDialog.confirmButton")}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	}

	return (
		<Dialog open={rows.length > 0} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{tUsersPage("deleteUsersDialog.title", { count: rows.length })}</DialogTitle>
					<DialogDescription>
						{tUsersPage("deleteUsersDialog.description")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline">{tUsersPage("deleteUsersDialog.cancelButton")}</Button>
					</DialogClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={deleteUsers}
					>
						{isExecuting && (
							<Loader />
						)}
						{tUsersPage("deleteUsersDialog.confirmButton")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
