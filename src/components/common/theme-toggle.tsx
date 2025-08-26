"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Icons } from "./icons"

export function ThemeToggle() {
	const { setTheme, resolvedTheme } = useTheme()

	function toggle() {
		setTheme((resolvedTheme && resolvedTheme === 'dark' ? 'light' : 'dark'))
	}

	return (
		<Button
			onClick={toggle}
			variant="ghost"
			size="icon"
		>
			<Icons.sun className="hidden dark:block size-4" />
			<Icons.moon className="block dark:hidden size-4" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
