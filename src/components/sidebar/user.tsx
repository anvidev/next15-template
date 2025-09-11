'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { Locale } from '@/i18n/routing'
import { cn, getInitials } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Icons } from '@/components/common/icons'
import { useAuth } from '@/components/providers/auth'

export function User() {
	const t = useTranslations("sidebar")
	const { setTheme, resolvedTheme } = useTheme()
	const { isMobile } = useSidebar()
	const router = useRouter()
	const locale = useLocale()
	const pathname = usePathname()

	const switchLocale = (newLocale: Locale) => {
		if (newLocale !== locale) {
			router.replace(pathname, { locale: newLocale })
			router.refresh()
		}
	}

	const { user, signOut } = useAuth()

	async function signOutHandler() {
		const didLogout = await signOut()
		if (didLogout) {
			toast('Goodbye, see you soon!')
			router.refresh()
		}
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
							<Avatar className='h-8 w-8 rounded-md'>
								<AvatarImage
									src={user?.image as string}
									alt={user?.name}
								/>
								<AvatarFallback className='rounded-md uppercase'>{getInitials(user?.name ?? "")}</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 gap-0.5 text-left text-xs'>
								<span className='truncate font-medium leading-none'>
									{user?.name}
								</span>
								<span className='truncate text-muted-foreground leading-none'>
									{user?.email}
								</span>
							</div>
							<Icons.upDownChevron className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-md'>
									<AvatarImage
										src={user?.image as string}
										alt={user?.name}
									/>
									<AvatarFallback className='rounded-md'>{getInitials(user?.name ?? "")}</AvatarFallback>
								</Avatar>
								<div className='grid gap-0.5 flex-1 text-left text-xs'>
									<span className='truncate font-medium leading-none'>
										{user?.name}
									</span>
									<span className='truncate text-xs leading-none'>{user?.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<Icons.eclipse />
									{t("userMenu.theme")}
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem onClick={() => setTheme('light')}>
											{t("userMenu.themeOption", { theme: 'light' })}
											<Icons.check
												className={cn(
													'hidden ml-auto',
													resolvedTheme == 'light' && 'block',
												)}
											/>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setTheme('dark')}>
											{t("userMenu.themeOption", { theme: 'dark' })}
											<Icons.check
												className={cn(
													'hidden ml-auto',
													resolvedTheme == 'dark' && 'block',
												)}
											/>
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<Icons.languages />
									{t("userMenu.language")}
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem onClick={() => switchLocale('en')}>
											{t("userMenu.languageOption", { lang: 'en' })}
											<Icons.check
												className={cn(
													'hidden ml-auto',
													locale == 'en' && 'block',
												)}
											/>
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => switchLocale('da')}>
											{t("userMenu.languageOption", { lang: 'da' })}
											<Icons.check
												className={cn(
													'hidden ml-auto',
													locale == 'da' && 'block',
												)}
											/>
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/account">
									<Icons.user />
									{t("userMenu.account")}
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Icons.help />
								{t("userMenu.support")}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={signOutHandler}>
							<Icons.logout />
							{t("userMenu.signOut")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
