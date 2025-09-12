"use client"

import { authService } from "@/service/auth/service"
import { Icons } from "../common/icons"
import { Button } from "../ui/button"
import { use } from "react"
import { Input } from "../ui/input"
import { AccountAccordion } from "./accordion"

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
					<CredentialsAccordions active={accountUsage.credential} />
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
	return (
		<AccountAccordion
			title="Skift email"
			description="Få tilsendt et link"
			icon={<Icons.email className="size-4 text-card-foreground" />}>
			<p>Hello</p>
		</AccountAccordion>
	)
}

function CredentialsAccordions({ active }: { active: boolean }) {
	return active ? (
		<AccountAccordion
			title="Skift kodeord"
			description="Få tilsendt et link"
			icon={<Icons.password className="size-4 text-card-foreground" />}>
			<p>Hello</p>
		</AccountAccordion>
	) : (
		<AccountAccordion
			title="Opret kodeord"
			description="Indtast en kode på minimum 8 karaterer"
			icon={<Icons.password className="size-4 text-card-foreground" />}>
			<p>Hello</p>
		</AccountAccordion>
	)
}

function PinAccordions({ active }: { active: boolean }) {
	return active ? (
		<AccountAccordion
			title="Skift PIN kode"
			description="Få tilsendt et link"
			icon={<Icons.pin className="size-4 text-card-foreground" />}>
			<p>Hello</p>
		</AccountAccordion>
	) : (
		<AccountAccordion
			title="Opret PIN kode"
			description="Indtast en 4-cifret kode"
			icon={<Icons.pin className="size-4 text-card-foreground" />}>
			<p>Hello</p>
		</AccountAccordion>
	)
}

function DangerAccordions() {
	return (

		<AccountAccordion
			title="Slet bruger"
			description="Slet min data fra systemet"
			icon={<Icons.trash className="size-4 text-card-foreground" />}>
			<p className="text-sm text-muted-foreground">Denne handling er permanent og kan ikke gøres om.</p>

			<p className="text-sm text-muted-foreground">Bekræft ved at skrive <strong>"Slet bruger"</strong> for at slette din bruger</p>

			<div className="flex items-center gap-2">
				<Input />
				<Button variant="destructive">Slet</Button>
			</div>
		</AccountAccordion>
	)
}
