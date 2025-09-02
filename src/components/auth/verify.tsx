"use client"

import { verifyAction } from "@/actions/auth";
import { Card, CardContent } from "@/components/ui/card"
import { Verification } from "@/store/auth/models"
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/loader";
import { useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function Verify({ verification }: { verification: Verification }) {
	const router = useRouter()
	const [pending, startTransition] = useTransition()

	async function verify() {
		startTransition(async () => {
			const response = await verifyAction({ token: verification.token })
			if (response.serverError) {
				toast(response.serverError)
				return
			}
			router.replace("/")
		})
	}

	return (
		<Card className="max-w-sm">
			<CardContent className="space-y-4">
				<p className="text-center text-sm text-muted-foreground">
					To protect your account and confirm your identity, we need to verify your email address. Please click the button below to complete the process and activate your account securely.
				</p>
				<Button className="w-full" onClick={verify}>
					{pending && <Loader />}
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
