import React from 'react'

import { Sidebar } from '@/components/sidebar/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function SiteLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<SidebarProvider>
			<Sidebar />
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	)
}
