
"use client"

import { consumeResetRequestAction, verifyNewEmailAction } from "@/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { authService } from "@/service/auth/service";
import * as React from 'react'
import { useAction } from "next-safe-action/hooks";
import { useTranslations } from "next-intl";
import { sendPasswordResetRequestValidation, sendPinResetRequestValidation } from "@/schemas/auth";
import { ResetRequestType } from "@/store/auth/models";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface Props {
	promise: Promise<Awaited<ReturnType<typeof authService.getResetRequest>>>
}

export function ResetCredentials({ promise }: Props) {
	const resetRequest = React.use(promise)
	const tValidations = useTranslations("validations")
	const tResetPage = useTranslations("resetPage")
	const router = useRouter()

	if (!resetRequest) {
		return <ResetRequestNotFound />
	}

	const pinSchema = sendPinResetRequestValidation(tValidations)
	const passwordSchema = sendPasswordResetRequestValidation(tValidations)
	const sendSchema = resetRequest.type === ResetRequestType.Password ? passwordSchema : pinSchema

	const form = useForm<z.infer<typeof sendSchema>>({
		resolver: zodResolver(sendSchema),
		defaultValues: {
			token: resetRequest.token,
			type: resetRequest.type,
			credential: "",
			confirmCredential: ""
		}
	})

	const { execute, isExecuting } = useAction(consumeResetRequestAction, {
		onError({ error }) {
			toast(error.serverError)
		},
		onSuccess() {
			toast("credential has been reset")
			router.replace("/sign-in")
		}
	})

	return (
		<Card className="max-w-sm w-full">
			<CardHeader>
				<CardTitle>{tResetPage("cardTitle", { type: resetRequest.type })}</CardTitle>
				<CardDescription>
					{tResetPage("cardDescription", { type: resetRequest.type })}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(execute)}>
						<FormField
							control={form.control}
							name="credential"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{tResetPage("credential", { type: resetRequest.type })}</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmCredential"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{tResetPage("confirmCredential", { type: resetRequest.type })}</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isExecuting}
							className="w-full">
							{isExecuting && <Loader />}
							{tResetPage("updateButton")}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

export function ResetRequestNotFound() {
	const tResetPage = useTranslations("resetPage")
	return (
		<Card className="max-w-sm">
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					{tResetPage("notFound")}
				</p>
			</CardContent>
		</Card>
	)
}
