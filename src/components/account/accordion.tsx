"use client"

import { cn } from "@/lib/utils"
import React, { PropsWithChildren, useState } from "react"
import { Icons } from "../common/icons"
import { type LucideIcon } from "lucide-react"

interface Props {
	leftIcon?: LucideIcon
	leftComp?: React.ReactNode
	title: string
	description: string,
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function AccountAccordion({
	title,
	description,
	leftIcon: LeftIcon,
	leftComp,
	open: externalOpen,
	onOpenChange,
	children,
}: PropsWithChildren<Props>) {
	const [internalOpen, setInternalOpen] = useState(false)
	const isControlled = externalOpen !== undefined
	const open = isControlled ? externalOpen : internalOpen

	function handleOnOpenChange() {
		if (!isControlled) {
			setInternalOpen(!open)
		}
		onOpenChange?.(!open)
	}

	const hasLeftGraphic = !!(LeftIcon || leftComp)

	function renderLeftGraphic() {
		if (leftComp) return leftComp
		else if (LeftIcon) {
			return (
				<div className="size-12 aspect-square self-start grid place-items-center bg-secondary rounded-lg">
					<LeftIcon className="size-4 text-card-foreground" />
				</div>
			)
		}
		else return null
	}

	return (
		<div className={cn("rounded-lg transition-colors", open && "bg-muted")}>
			<button
				className={cn("p-2 flex items-center z-20 gap-4 rounded-lg hover:bg-muted w-full transition-colors", open && "bg-muted")}
				onClick={() => handleOnOpenChange()}>
				{hasLeftGraphic && renderLeftGraphic()}
				<div className="text-start">
					<p className="font-medium text-sm leading-tight">{title}</p>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
				<div className="size-9 grid place-items-center ml-auto">
					<Icons.chevronRight className={cn("size-4 text-muted-foreground transition-[height]", open && "rotate-90")} />
				</div>
			</button>
			<div className={cn("h-0 hidden text-sm text-muted-foreground z-10 transition-transform p-2 flex-col gap-3 max-h-max rounded-b-lg bg-muted", open && "flex h-max")}>
				{children}
			</div>
		</div>
	)
}
