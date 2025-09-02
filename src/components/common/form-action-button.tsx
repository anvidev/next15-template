'use client'

import { VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { useTransition } from "react"
import { Loader } from "./loader"


export function FormActionButton({
	children,
	className,
	size,
	variant,
	action,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		action: () => Promise<void>
	}) {
	const [pending, startTransition] = useTransition()

	function submit() {
		startTransition(async () => {
			await action()
		})
	}
	return (
		<form action={submit}>
			<Button
				type="submit"
				className={cn(buttonVariants({ size, variant, className }))}
				{...props}>
				{pending && <Loader />}
				{children}
			</Button>
		</form>
	)
}
