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

const data = {
	user: {
		name: "anvi",
		email: "me@anvi.dev",
		avatar: "/avatars/shadcn.jpg",
	},
	navMain: [
		{
			title: "Home",
			url: "#",
			icon: Icons.home,
		},
		{
			title: "Documentation",
			url: "#",
			icon: BookOpen,
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
			title: "Settings",
			url: "#",
			icon: Icons.settings,
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

export function Sidebar({ ...props }: React.ComponentProps<typeof ShadcnSidebar>) {
	return (
		<ShadcnSidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<Navigation items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<User user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</ShadcnSidebar>
	)
}
