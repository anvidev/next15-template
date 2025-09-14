"use client"

import { SafeResult } from "@/lib/try-catch"
import { resetPinValidation } from "@/schemas/auth"
import { authService } from "@/service/auth/service"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { use } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button } from "../ui/button"
import { useRouter } from "@/i18n/navigation"
import { useAction } from "next-safe-action/hooks"
import { resetPinAction } from "@/actions/auth"
import { toast } from "sonner"
import { Loader } from "../common/loader"

interface Props {
	promise: Promise<SafeResult<Awaited<ReturnType<typeof authService.getVerification>>>>
}

export function ResetPin({ promise }: Props) {
	const router = useRouter()
	const { success, data: verification } = use(promise)
	const tValidations = useTranslations("validations")
	const schema = resetPinValidation(tValidations)

	if (!success) {
		return <ResetNotFound />
	}


	const { execute, isExecuting } = useAction(resetPinAction, {
		onError(args) {
			toast("not good fam")
		},
		onSuccess(args) {
			toast("all good fam")
		},
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			token: verification.token,
		}

	})

	return (
		<Card className="max-w-sm w-full">
			<CardHeader>
				<CardTitle>Reset PIN code</CardTitle>
				<CardDescription>
					Create a new 4-digit PIN to secure your account
				</CardDescription>
			</CardHeader>
			<CardContent className="">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(execute)} className="space-y-4">
						<FormField
							control={form.control}
							name="pin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>PIN code</FormLabel>
									<FormControl>
										<InputOTP
											inputMode="numeric"
											containerClassName="justify-center"
											autoFocus
											maxLength={4}
											{...field}>
											<InputOTPGroup className="w-full">
												<InputOTPSlot index={0} className="w-1/4" />
												<InputOTPSlot index={1} className="w-1/4" />
												<InputOTPSlot index={2} className="w-1/4" />
												<InputOTPSlot index={3} className="w-1/4" />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormDescription>
										Your PIN is encrypted and stored securely
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							disabled={isExecuting || form.watch('pin', 0).toString().length !== 4}
							className="w-full">
							{isExecuting && <Loader />}
							Reset PIN
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

function ResetNotFound() {
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
