"use client"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
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
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Icons } from "../common/icons"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { Locale } from "@/i18n/routing"

export function User() {
	const { setTheme, resolvedTheme } = useTheme()
	const { isMobile } = useSidebar()
	const router = useRouter()
	const locale = useLocale();
	const pathname = usePathname();

	const switchLocale = (newLocale: Locale) => {
		if (newLocale !== locale) {
			router.replace(pathname, { locale: newLocale });
			router.refresh();
		}
	};

	const { data } = authClient.useSession()

	async function signOut() {
		await authClient.signOut()
		toast("Goodbye, see you soon!")
		router.refresh()
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-md">
								<AvatarImage src={data?.user.image as string} alt={data?.user.name} />
								<AvatarFallback className="rounded-md">CN</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-xs leading-tight">
								<span className="truncate font-bold leading-none">{data?.user.name}</span>
								<span className="truncate text-muted-foreground leading-none">{data?.user.email}</span>
							</div>
							<Icons.upDownChevron className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-md">
									<AvatarImage src={data?.user.image as string} alt={data?.user.name} />
									<AvatarFallback className="rounded-md">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{data?.user.name}</span>
									<span className="truncate text-xs">{data?.user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<Icons.eclipse />
									Theme
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem onClick={() => setTheme('light')}>
											Light
											<Icons.check className={cn("hidden ml-auto", resolvedTheme == 'light' && 'block')} />
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setTheme('dark')}>
											Dark
											<Icons.check className={cn("hidden ml-auto", resolvedTheme == 'dark' && 'block')} />
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<Icons.languages />
									Languages
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent>
										<DropdownMenuItem onClick={() => switchLocale('en')}>
											English
											<Icons.check className={cn("hidden ml-auto", locale == 'en' && 'block')} />
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => switchLocale('da')}>
											Danish
											<Icons.check className={cn("hidden ml-auto", locale == 'da' && 'block')} />
										</DropdownMenuItem>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Icons.user />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Icons.help />
								Support
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={signOut}>
							<Icons.logout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
