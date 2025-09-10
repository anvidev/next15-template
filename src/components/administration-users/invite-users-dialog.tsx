"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { inviteUsersValidation } from "@/schemas/auth"
import { Role, roles } from "@/store/auth/models"
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from "next-intl"
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form"
import z from "zod"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react"
import { Icons } from "../common/icons"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import { inviteUsersAction } from "@/actions/auth"
import { toast } from "sonner"
import { Loader } from "../common/loader"

export function InviteUsersDialog() {
	const isMobile = useIsMobile()
	const [open, setOpen] = useState(false)
	const tUsersPage = useTranslations("usersPage")
	const tValidations = useTranslations("validations")
	const inviteSchema = inviteUsersValidation(tValidations)

	const { execute, isExecuting } = useAction(inviteUsersAction, {
		onError() {
			toast(tUsersPage("inviteUsersDialog.errorToast"))
		},
		onSuccess({ input }) {
			toast(tUsersPage("inviteUsersDialog.successToast", { count: input.invitations.length }))
			form.reset()
			setOpen(false)
		},
	})

	const expiresDurations = [
		{ label: tUsersPage("inviteUsersDialog.expiryOptionOne"), expiresIn: 1 },
		{ label: tUsersPage("inviteUsersDialog.expiryOptionTwo"), expiresIn: 3 },
		{ label: tUsersPage("inviteUsersDialog.expiryOptionThree"), expiresIn: 7 },
	]

	const form = useForm<z.infer<typeof inviteSchema>>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			invitations: [
				{ email: "" }
			],
			role: Role.User,
			expiresInDays: expiresDurations[0].expiresIn
		}
	})

	if (isMobile) {
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
					className='size-7'>
					<Icons.plus />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>
						{tUsersPage("inviteUsersDialog.title")}
					</DrawerTitle>
					<DrawerDescription>
						{tUsersPage("inviteUsersDialog.description")}
					</DrawerDescription>
				</DrawerHeader>
				<div className="py-4">
					<InviteForm
						form={form}
						expiresInDays={expiresDurations}
						execute={execute}
						isExecuting={isExecuting} />
				</div>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<DrawerClose asChild>
						<Button variant="outline">
							{tUsersPage("inviteUsersDialog.cancelButton")}
						</Button>
					</DrawerClose>
					<Button
						aria-label="Delete selected rows"
					>
						{isExecuting && (
							<Loader />
						)}
						{tUsersPage("inviteUsersDialog.confirmButton")}
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
					className='size-7'>
					<Icons.plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{tUsersPage("inviteUsersDialog.title")}
					</DialogTitle>
					<DialogDescription>
						{tUsersPage("inviteUsersDialog.description")}
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<InviteForm
						form={form}
						expiresInDays={expiresDurations}
						execute={execute}
						isExecuting={isExecuting} />
				</div>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline">
							{tUsersPage("inviteUsersDialog.cancelButton")}
						</Button>
					</DialogClose>
					<Button
						type="submit"
						form="invite-form"
						aria-label="Delete selected rows"
					>
						{isExecuting && (
							<Loader />
						)}
						{tUsersPage("inviteUsersDialog.confirmButton")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function InviteForm({
	form,
	expiresInDays,
	execute,
	isExecuting,
}: {
	form: UseFormReturn<z.infer<ReturnType<typeof inviteUsersValidation>>>
	expiresInDays: { label: string, expiresIn: number }[]
	execute: (input: z.infer<ReturnType<typeof inviteUsersValidation>>) => void
	isExecuting: boolean
}) {
	const tUsersPage = useTranslations("usersPage")
	const { fields, append, remove } = useFieldArray({
		name: "invitations",
		control: form.control,
	})

	return (
		<Form {...form}>
			<form
				id='invite-form'
				onSubmit={form.handleSubmit(execute)}
				className='space-y-4'>
				<div className="w-full flex items-start gap-4">
					<FormField
						control={form.control}
						name="expiresInDays"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>{tUsersPage("inviteUsersDialog.expiryLabel")}</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{expiresInDays.map(ex => (
											<SelectItem key={ex.label} value={ex.expiresIn.toString()}>{ex.label}</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>{tUsersPage("inviteUsersDialog.roleLabel")}</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{roles.map(role => (
											<SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="space-y-2">
					{fields.map((field, index) => (
						<FormField
							control={form.control}
							key={field.id}
							name={`invitations.${index}.email`}
							render={({ field }) => (
								<FormItem className="grow">
									<FormLabel className={cn(index !== 0 && 'sr-only')}>{tUsersPage("inviteUsersDialog.emailLabel")}</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2">
											<Input placeholder={tUsersPage("inviteUsersDialog.emailPlaceholder")} {...field} />
											<Button
												type="button"
												variant='outline'
												size='icon'
												disabled={index === 0 || isExecuting}
												className={cn(index === 0 && "self-end")}
												onClick={() => remove(index)}>
												<Icons.cross />
												<p className="sr-only">{tUsersPage("inviteUsersDialog.emailRemoveButton")}</p>
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</div>
				<Button
					type="button"
					variant="secondary"
					onClick={() => append({ email: "" })}
					disabled={fields.length >= 10 || isExecuting}>{tUsersPage("inviteUsersDialog.emailAddButton")}</Button>
			</form>
		</Form>
	)
}
