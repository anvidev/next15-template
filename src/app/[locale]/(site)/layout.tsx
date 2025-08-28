import React from "react";

import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar"
import { Sidebar } from "@/components/sidebar/sidebar";

export default function SiteLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
