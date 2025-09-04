import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'
import { SidebarTrigger } from '../ui/sidebar'

function Header({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<header
			className={cn(
				'sticky top-0 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b',
				className,
			)}
			{...props}>
			<div className='flex items-center gap-2 px-4 w-full'>
				<SidebarTrigger className='-ml-1' />
				<Separator
					orientation='vertical'
					className='mr-2 data-[orientation=vertical]:h-5'
				/>
				{children}
			</div>
		</header>
	)
}

function Content({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('flex flex-1 flex-col gap-4 p-4 pt-0', className)}
			{...props}>
			{children}
		</div>
	)
}

function Title({
	className,
	...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h1
			className={cn('font-normal text-foreground text-sm', className)}
			{...props}
		/>
	)
}

function Actions({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('ml-auto flex items-center gap-2 -mr-1', className)}
			{...props}>
			{children}
		</div>
	)
}

export const Page = {
	Header,
	Content,
	Title,
	Actions,
}
