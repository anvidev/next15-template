"use client"

import { authService } from "@/service/auth/service"
import { Icons } from "../common/icons"
import { Button } from "../ui/button"
import { use, useState } from "react"
import { Input } from "../ui/input"
import { AccountAccordion } from "./accordion"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useAction } from "next-safe-action/hooks"
import { createPinAction, deleteOwnUserAction, resetAccountProviderAction } from "@/actions/auth"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Loader } from "../common/loader"
import { useRouter } from "@/i18n/navigation"
import { VerificationType } from "@/store/auth/models"
import { Skeleton } from "../ui/skeleton"

interface Props {
	promise: Promise<Awaited<ReturnType<typeof authService.listAccountUses>>>
}

export function Actions({ promise }: Props) {
	const accountUsage = use(promise)

	return (
		<>
			<div className="space-y-3">
				<p className="text-muted-foreground font-medium text-sm">Sikkerhed</p>
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<EmailAccordion />
					<PasswordAccordions active={accountUsage.credential} />
					<PinAccordions active={accountUsage.pin} />
				</div>
			</div>
			<div className="space-y-3">
				<p className="text-muted-foreground font-medium text-sm">Farezone</p>
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<DangerAccordions />
				</div>
			</div>
		</>
	)
}

function EmailAccordion() {
	const { execute, isExecuting } = useAction(resetAccountProviderAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("successToast")
		},
	})

	return (
		<AccountAccordion
			title="Skift email"
			description="Modtag et link til at ændre email"
			leftIcon={Icons.email}>
			<p className="text-sm text-muted-foreground">Du får tilsendt en mail med et link, hvor du kan ændre din email.</p>
			<p className="text-sm text-muted-foreground">Linket er gyldigt i 1 time.</p>
			<Button disabled={isExecuting} onClick={() => execute({ type: VerificationType.Email })}>
				{isExecuting && <Loader />}
				Send link
			</Button>
		</AccountAccordion>
	)
}

function PasswordAccordions({ active }: { active: boolean }) {
	const { execute: resetPassword, isExecuting: isResetingPassword } = useAction(resetAccountProviderAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("successToast")
		},
	})

	return active ? (
		<AccountAccordion
			title="Skift adgangskode"
			description="Modtag et link til at ændre adgangskode"
			leftIcon={Icons.password}>
			<p className="text-sm text-muted-foreground">Du får tilsendt en mail med et link, hvor du kan ændre din adgangskode.</p>
			<p className="text-sm text-muted-foreground">Linket er gyldigt i 1 time.</p>
			<Button disabled={isResetingPassword} onClick={() => resetPassword({ type: VerificationType.Password })}>
				{isResetingPassword && <Loader />}
				Send link
			</Button>
		</AccountAccordion>
	) : (
		<AccountAccordion
			title="Opret kodeord"
			description="Indtast en kode på minimum 8 karaterer"
			leftIcon={Icons.password}>
			<p>Hello</p>
		</AccountAccordion>
	)
}

function PinAccordions({ active }: { active: boolean }) {
	const t = useTranslations()
	const [pin, setPin] = useState("")

	const { execute: resetPin, isExecuting: isResetingPin } = useAction(resetAccountProviderAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("successToast")
		},
	})

	const { execute: createPin, isExecuting: isCreatingPin } = useAction(createPinAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else if (error.validationErrors) {
				toast(error.validationErrors.pin)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("successToast")
			setPin('')
		},
	})

	return active ? (
		<AccountAccordion
			title="Skift PIN-kode"
			description="Modtag et link til at ændre PIN-kode"
			leftIcon={Icons.pin}>
			<p className="text-sm text-muted-foreground">Du får tilsendt en mail med et link, hvor du kan ændre din PIN-kode.</p>
			<p className="text-sm text-muted-foreground">Linket er gyldigt i 1 time.</p>
			<Button disabled={isResetingPin} onClick={() => resetPin({ type: VerificationType.PIN })}>
				{isResetingPin && <Loader />}
				Send link
			</Button>
		</AccountAccordion>
	) : (
		<AccountAccordion
			onOpenChange={() => setPin("")}
			title="Opret PIN-kode"
			description="Vælg en 4-cifret kode"
			leftIcon={Icons.pin}>
			<p className="text-sm text-muted-foreground">PIN-koden bruges til at logge ind i mobilappen.</p>

			<div className="flex items-center gap-2">
				<InputOTP
					pattern={REGEXP_ONLY_DIGITS}
					inputMode="numeric"
					maxLength={4}
					minLength={4}
					value={pin}
					disabled={isCreatingPin}
					onChange={(value) => setPin(value)}
				>
					<InputOTPGroup>
						<InputOTPSlot index={0} />
						<InputOTPSlot index={1} />
						<InputOTPSlot index={2} />
						<InputOTPSlot index={3} />
					</InputOTPGroup>
				</InputOTP>
				<Button
					disabled={pin.length !== 4 || isCreatingPin}
					onClick={() => createPin({ pin })}>
					{isCreatingPin && <Loader />}
					Opret
				</Button>
			</div>
		</AccountAccordion>
	)
}

function DangerAccordions() {
	const router = useRouter()
	const [value, setValue] = useState("")

	const { execute, isExecuting } = useAction(deleteOwnUserAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("Konto slettet")
			router.replace("/sign-in")
		},
	})

	return (
		<AccountAccordion
			title="Slet konto"
			description="Fjern al din data permanent"
			leftIcon={Icons.trash}>
			<p className="text-sm text-muted-foreground">Denne handling er permanent og kan ikke fortrydes.</p>

			<p className="text-sm text-muted-foreground">Bekræft ved at skrive <strong>&quot;Slet konto&quot;</strong> for at slette din konto.</p>

			<div className="flex items-center gap-2">
				<Input disabled={isExecuting} value={value} onChange={e => setValue(e.target.value)} />
				<Button
					variant="destructive"
					disabled={value.toLowerCase() !== "slet konto" || isExecuting}
					onClick={() => execute()}>
					{isExecuting && <Loader />}
					Slet
				</Button>
			</div>
		</AccountAccordion>
	)
}

export function ActionsSkeleton() {
	return (
		<>
			<div className="space-y-3">
				<Skeleton className="h-5 w-16" />
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<Skeleton className="w-full h-52" />
				</div>
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-16" />
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<Skeleton className="w-full h-20" />
				</div>
			</div>
		</>
	)
}
