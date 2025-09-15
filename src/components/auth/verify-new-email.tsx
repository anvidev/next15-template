"use client"

import { verifyNewEmailAction } from "@/actions/auth";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { authService } from "@/service/auth/service";
import * as React from 'react'
import { useAction } from "next-safe-action/hooks";

interface Props {
	promise: Promise<Awaited<ReturnType<typeof authService.getVerification>>>
}

export function VerifyNewEmail({ promise }: Props) {
	const verification = React.use(promise)
	const router = useRouter()
	const { execute, isExecuting } = useAction(verifyNewEmailAction, {
		onError({ error }) {
			toast(error.serverError)
		},
		onSuccess() {
			toast("Email has been verified")
			router.replace("/account")
		}
	})

	if (!verification) {
		return <VerifyNotFound />
	}

	return (
		<Card className="max-w-sm">
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					We need to verify your new email to complete the change. Click the button below to confirm ownership of this email and update your account.
				</p>
				<Button disabled={isExecuting} className="w-full" onClick={() => execute({ token: verification.token })}>
					{isExecuting && <Loader />}
					Verify email
				</Button>
			</CardContent>
		</Card>
	)
}

export function VerifyNotFound() {
	return (
		<Card className="max-w-sm">
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					This verification link is invalid or has already been used.
				</p>
			</CardContent>
		</Card>
	)
}
