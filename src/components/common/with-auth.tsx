import { redirect } from '@/i18n/navigation'
import { Locale } from '@/i18n/routing'
import { auth } from '@/lib/auth'
import { Session, User } from 'better-auth'
import { headers } from 'next/headers'
import React from 'react'

export type WithAuthProps = {
	user: User
	session: Session
	locale: Locale
}

export function withAuth<P extends WithAuthProps>(
	WrappedComponent: React.ComponentType<P>,
) {
	type ComponentProps = Omit<P, keyof WithAuthProps> & {
		params: Promise<{ locale: Locale }>
	}

	return async function AuthenticatedComponent(props: ComponentProps) {
		const { params, ...restProps } = props
		const resolvedParams = await params
		const session = await auth.api.getSession({ headers: await headers() })
		// TODO: get pathname and use for redirect after sign in

		if (!session) {
			redirect({
				href: `/sign-in`,
				locale: resolvedParams.locale,
			})
			return
		}

		return (
			<WrappedComponent
				// @ignore
				{...(restProps as any)}
				user={session.user}
				session={session.session}
				locale={resolvedParams.locale}
			/>
		)
	}
}
