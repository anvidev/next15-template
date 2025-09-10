import { Icons } from '@/components/common/icons'
import { redirect } from '@/i18n/navigation'
import { authService } from '@/service/auth/service'
import React from 'react'

export default async function AuthLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params
	const { session } = await authService.verify()

	if (session) {
		redirect({
			href: "/",
			locale
		})
	}

	return (
		<main className='min-h-screen w-full bg-transparent relative overflow-hidden grid place-items-center'>
			<div
				className='absolute inset-0 z-0 pointer-events-none'
				style={{
					background: `
					   radial-gradient(
						 circle at top,
						 rgba(255, 255, 255, 0.08) 0%,
						 rgba(255, 255, 255, 0.08) 20%,
						 rgba(0, 0, 0, 0.0) 60%
					   )
					 `,
				}}
			/>
			<div className='flex w-full flex-col items-center gap-8'>
				<Logo />
				{children}
			</div>
		</main>
	)
}

function Logo() {
	return (
		<a href='#' className='flex items-center gap-2 self-center font-medium'>
			<div className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md'>
				<Icons.warehouse className='size-4' />
			</div>
			<span className='font-bold tracking-tight'>Nem Status</span>
		</a>
	)
}
