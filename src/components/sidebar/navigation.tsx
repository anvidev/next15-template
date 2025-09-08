'use client'

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@/i18n/navigation'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { useAuth } from '../providers/auth'
import { NavigationItem } from './sidebar'
import { Role } from '@/store/auth/models'

export function Navigation({
	items,
}: {
	items: NavigationItem[]
}) {
	const { state, setOpen } = useSidebar()
	const { user } = useAuth()

	function openIfCollapsed() {
		if (state !== 'collapsed') {
			return
		}
		setOpen(true)
	}

	function hasAccess(item: { roles?: Role[] }, userRole: Role): boolean {
		return !item.roles || item.roles.includes(userRole)
	}

	if (!user) return null

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Navigation</SidebarGroupLabel>
			<SidebarMenu>
				{items
					.filter(i => hasAccess(i, user.role))
					.map(item =>
						item.items ? (
							<Collapsible key={item.title} asChild className='group/collapsible'>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={item.title} onClick={openIfCollapsed}>
											{item.icon && item.icon}
											<span>{item.title}</span>
											<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.items
												.filter(i => hasAccess(i, user.role))
												.map(subItem => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						) : (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton tooltip={item.title} asChild>
									<Link href={item.url}>
										{item.icon && item.icon}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						),
					)}
			</SidebarMenu>
		</SidebarGroup>
	)
}
