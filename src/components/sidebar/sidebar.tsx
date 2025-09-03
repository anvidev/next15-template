'use client'

import { Logo } from '@/components/sidebar/logo'
import { Navigation } from '@/components/sidebar/navigation'
import { User } from '@/components/sidebar/user'
import {
	Sidebar as ShadcnSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { Icons } from '../common/icons'

export function Sidebar({
	...props
}: React.ComponentProps<typeof ShadcnSidebar>) {
	const t = useTranslations('sidebar')

	const navItems = {
		navMain: [
			{
				title: t('home'),
				url: '#',
				icon: <Icons.home />,
			},
			{
				title: t('administration'),
				url: '#',
				icon: <Icons.settings />,
				items: [
					{
						title: t('users'),
						url: '/administration/users',
					},
					{
						title: t('organization'),
						url: '#',
					},
					{
						title: t('billing'),
						url: '#',
					},
				],
			},
		],
	}

	return (
		<ShadcnSidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<Logo />
			</SidebarHeader>
			<SidebarContent>
				<Navigation items={navItems.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<User />
			</SidebarFooter>
			<SidebarRail />
		</ShadcnSidebar>
	)
}
