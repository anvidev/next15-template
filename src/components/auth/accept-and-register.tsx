"use client"

import { acceptInviteAction } from "@/actions/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { authService } from "@/service/auth/service";
import * as React from 'react'
import { useAction } from "next-safe-action/hooks";
import { SafeResult } from "@/lib/try-catch";
import { useForm } from "react-hook-form";
import { acceptAndRegisterValidation } from "@/schemas/auth";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface Props {
	promise: Promise<SafeResult<Awaited<ReturnType<typeof authService.getInvitation>>>>
}

export function AcceptAndRegister({ promise }: Props) {
	const { success, data: invitation } = React.use(promise)
	const router = useRouter()
	const t = useTranslations()
	const acceptAndInviteSchema = acceptAndRegisterValidation(t)
	const { execute, isExecuting } = useAction(acceptInviteAction, {
		onError({ error }) {
			toast(error.serverError)
		},
		onSuccess({ input }) {
			toast(`Welcome ${input.name}`)
			router.replace("/")
		}
	})

	const form = useForm<z.infer<typeof acceptAndInviteSchema>>({
		resolver: zodResolver(acceptAndInviteSchema),
		defaultValues: {
			token: invitation?.token,
			email: invitation?.email,
			name: "",
			password: "",
		}
	})

	if (!success) {
		return <InviteNotFound />
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Welcome</CardTitle>
				<CardDescription>
					Enter your information below to get started
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id='accept-invite-form'
						onSubmit={form.handleSubmit(execute)}
						className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type='text' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input disabled type='text' readOnly autoComplete='name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											autoComplete='current-password webauthn'
											{...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex-col gap-2'>
				<Button disabled={isExecuting} form='accept-invite-form' type='submit' className='w-full'>
					{isExecuting && <Loader />}
					Accept invite
				</Button>
			</CardFooter>
		</Card>
	)
}

export function InviteNotFound() {
	return (
		<Card className="max-w-sm w-full">
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					This invitation link is invalid or has already been used.
				</p>
			</CardContent>
		</Card>
	)
}
