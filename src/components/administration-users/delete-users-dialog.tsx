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

export function DeleteUsersDialog() {
	const [rows, setRows] = useState<Row<User>[]>([])
	const isMobile = useIsMobile();

	const { execute, isExecuting } = useAction(deleteUsersAction, {
		onError() {
			toast("Could not delete user")
		},
		onSuccess(args) {
			toast(`User${args.input.ids.length > 1 ? 's' : ''} deleted`)
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
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>
						This action cannot be undone. This will permanently delete your{" "}
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={deleteUsers}
					>
						{isExecuting && (
							<Loader />
						)}
						Delete
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	}

	return (
		<Dialog open={rows.length > 0} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your{" "}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						aria-label="Delete selected rows"
						variant="destructive"
						onClick={deleteUsers}
					>
						{isExecuting && (
							<Loader />
						)}
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
