"use client"

import { cn } from "@/lib/utils"
import React, { PropsWithChildren, useState } from "react"
import { Icons } from "../common/icons"

interface Props {
	icon: React.JSX.Element
	title: string
	description: string
}

export function AccountAccordion({
	title,
	description,
	icon,
	children,
}: PropsWithChildren<Props>) {
	const [open, setOpen] = useState(false)
	return (
		<div className={cn("rounded-lg transition-colors", open && "bg-muted")}>
			<button
				className={cn("p-2 flex items-center z-20 gap-4 rounded-lg hover:bg-muted w-full transition-colors", open && "bg-muted")}
				onClick={() => setOpen(!open)}>
				<div className="size-12 grid place-items-center bg-secondary rounded-lg">
					{icon}
				</div>
				<div className="text-start">
					<p className="font-medium text-sm leading-tight">{title}</p>
					<p className="text-muted-foreground text-sm">{description}</p>
				</div>
				<div className="size-9 grid place-items-center ml-auto">
					<Icons.chevronRight className={cn("size-4 text-muted-foreground transition-[height]", open && "rotate-90")} />
				</div>
			</button>
			<div className={cn("h-0 hidden text-sm text-muted-foreground z-10 transition-transform p-2 flex-col gap-2 max-h-max rounded-b-lg bg-muted", open && "flex h-max")}>
				{children}
			</div>
		</div>
	)
}
