"use client"

import * as React from "react"
import {
	BookOpen,
} from "lucide-react"

import { Navigation } from "@/components/sidebar/navigation"
import { User } from "@/components/sidebar/user"
import { Logo } from "@/components/sidebar/logo"
import {
	Sidebar as ShadcnSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { Icons } from "../common/icons"
import { useTranslations } from "next-intl"

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
	const t = useTranslations("sidebar")
	const data = {
		navMain: [
			{
				title: t("home"),
				url: "#",
				icon: <Icons.home />,
			},
			{
				title: t("documentation"),
				url: "#",
				icon: <Icons.sun />,
				items: [
					{
						title: "Introduction",
						url: "#",
					},
					{
						title: "Get Started",
						url: "#",
					},
					{
						title: "Tutorials",
						url: "#",
					},
					{
						title: "Changelog",
						url: "#",
					},
				],
			},
			{
				title: t("settings"),
				url: "#",
				icon: <Icons.settings />,
				items: [
					{
						title: "General",
						url: "#",
					},
					{
						title: "Team",
						url: "#",
					},
					{
						title: "Billing",
						url: "#",
					},
					{
						title: "Limits",
						url: "#",
					},
				],
			},
		],
	}

	return (
		<ShadcnSidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<Navigation items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<User />
			</SidebarFooter>
			<SidebarRail />
		</ShadcnSidebar>
	)
}
