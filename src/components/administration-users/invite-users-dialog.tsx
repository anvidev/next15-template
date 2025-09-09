"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { InviteUsersInput, inviteUsersValidation } from "@/schemas/auth"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn } from "@/lib/utils"

export function InviteUsersDialog() {
	const t = useTranslations()
	const isMobile = useIsMobile()
	const inviteSchema = inviteUsersValidation(t)
	const [open, setOpen] = useState(false)

	const expiresDurations = [
		{ label: '1 day', expiresIn: 1 },
		{ label: '3 days', expiresIn: 3 },
		{ label: '7 days', expiresIn: 7 },
	]

	const form = useForm<z.infer<typeof inviteSchema>>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			emails: [""],
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
					<DrawerTitle>Invite users</DrawerTitle>
					<DrawerDescription>
						Users will receive an invition mail with registration link
					</DrawerDescription>
				</DrawerHeader>
				<div className="py-4">
					<InviteForm form={form} expiresInDays={expiresDurations} />
				</div>
				<DrawerFooter className="gap-2 sm:space-x-0">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
					<Button
						aria-label="Delete selected rows"
					>
						Invite
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
					<DialogTitle>Invite users</DialogTitle>
					<DialogDescription>
						Users will receive an invition mail with registration link
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<InviteForm form={form} expiresInDays={expiresDurations} />
				</div>
				<DialogFooter className="gap-2 sm:space-x-0">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						aria-label="Delete selected rows"
					>
						Invite
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

function InviteForm({
	form,
	expiresInDays
}: {
	form: UseFormReturn<InviteUsersInput>
	expiresInDays: { label: string, expiresIn: number }[]
}) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "emails",
		// rules: { minLength: 1 }
	})

	return (
		<Form {...form}>
			<form
				id='invite-form'
				// onSubmit={form.handleSubmit(execute)}
				className='space-y-4'>
				<div className="w-full flex items-center gap-4">
					<FormField
						control={form.control}
						name="expiresInDays"
						render={({ field }) => (
							<FormItem className="w-1/2">
								<FormLabel>Expiry</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a verified email to display" />
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
								<FormLabel>Role</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a verified email to display" />
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
				<div>
					{fields.map((field, index) => (
						<FormField
							control={form.control}
							key={field.id}
							name={`emails.${index}`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className={cn(index !== 0 && 'sr-only')}>Username</FormLabel>
									<FormControl>
										<Input placeholder="shadcn" {...field} />
									</FormControl>
									<FormDescription>
										This is your public display name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
				</div>
				<Button type="button" onClick={() => append()}>Moar</Button>
			</form>
		</Form>
	)
}
