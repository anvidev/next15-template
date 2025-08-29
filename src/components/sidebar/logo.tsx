'use client'

import { Icons } from '@/components/common/icons'
import { Link } from '@/i18n/navigation'

export function Logo() {
	return (
		<Link
			href='/'
			className='peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-12 text-sm group-data-[collapsible=icon]:p-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
			<div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md'>
				<Icons.warehouse className='size-4' />
			</div>
			<div className='grid flex-1 text-left text-sm'>
				<span className='truncate text-xs font-bold leading-none'>
					Nem Status
				</span>
				<span className='truncate text-xs text-muted-foreground leading-none'>
					By Skancode
				</span>
			</div>
		</Link>
	)
}
