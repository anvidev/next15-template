"use client"

import { verifyAction } from "@/actions/auth";
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { authService } from "@/service/auth/service";
import * as React from 'react'
import { useAction } from "next-safe-action/hooks";
import { SafeResult } from "@/lib/try-catch";

interface Props {
	promise: Promise<SafeResult<Awaited<ReturnType<typeof authService.getVerification>>>>
}

export function Verify({ promise }: Props) {
	const { success, data: verification } = React.use(promise)
	const router = useRouter()
	const { execute, isExecuting } = useAction(verifyAction, {
		onError({ error }) {
			toast(error.serverError)
		},
		onSuccess() {
			toast("Email has been verified")
			router.replace("/")
		}
	})

	if (!success) {
		return <VerifyNotFound />
	}

	return (
		<Card className="max-w-sm">
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					To protect your account and confirm your identity, we need to verify your email address. Please click the button below to complete the process and activate your account securely.
				</p>
				<Button className="w-full" onClick={() => execute({ token: verification.token })}>
					{isExecuting && <Loader />}
					Confirm verification
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
