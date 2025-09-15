"use client"

import { User } from "@/store/auth/models"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getInitials } from "@/lib/utils"
import { Button } from "../ui/button"
import { AccountAccordion } from "./accordion"
import { Input } from "../ui/input"
import { useAction } from "next-safe-action/hooks"
import { updateOwnProfileAction } from "@/actions/auth"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import z from "zod"
import { updateProfileValidation } from "@/schemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "../ui/form"
import { toast } from "sonner"
import { useState } from "react"
import { Loader } from "../common/loader"

interface Props {
	user: User
}

export function Display({ user }: Props) {
	const tAccountPage = useTranslations("accountPage")
	const [open, setOpen] = useState(false)
	const { execute, isExecuting } = useAction(updateOwnProfileAction, {
		onError(args) {
			toast("not good")
		},
		onSuccess(args) {
			toast("very good")
			setOpen(false)
		},
	})

	const t = useTranslations('validations')
	const schema = updateProfileValidation(t)
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: user.name,
			image: user.image || ""
		}
	})

	return (
		<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
			<AccountAccordion
				open={open}
				onOpenChange={open => setOpen(open)}
				title={user.name}
				description={user.email}
				leftComp={
					<Avatar className='size-12 rounded-lg'>
						<AvatarImage
							src={user.image as string}
							alt={user.name}
						/>
						<AvatarFallback className='rounded-lg uppercase'>
							{getInitials(user.name)}
						</AvatarFallback>
					</Avatar>
				}>
				<p className="text-sm text-muted-foreground">
					{tAccountPage("userAccordion.textOne")}
				</p>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(execute)} className="flex flex-col items-center gap-3">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>{tAccountPage("userAccordion.name")}</FormLabel>
									<FormControl>
										<Input
											placeholder={tAccountPage("userAccordion.namePlaceholder")}
											{...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>{tAccountPage("userAccordion.image")}</FormLabel>
									<FormControl>
										<Input
											placeholder={tAccountPage("userAccordion.imagePlaceholder")}
											{...field} />
									</FormControl>
									<FormDescription>
										{tAccountPage("userAccordion.imageDescription")}
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isExecuting}
							type="submit"
							className="w-full">
							{isExecuting && <Loader />}
							{tAccountPage("userAccordion.updateButton")}
						</Button>
					</form>
				</Form>
			</AccountAccordion>
		</div>
	)
}

