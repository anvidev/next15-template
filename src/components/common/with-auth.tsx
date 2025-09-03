import { redirect } from '@/i18n/navigation'
import { Locale } from '@/i18n/routing'
import { TFunc } from '@/i18n/types'
import { authService } from '@/service/auth/service'
import { Session, Tenant, User } from '@/store/auth/models'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export type WithAuthProps = {
	session: Session
	user: User
	tenant: Tenant
	locale: Locale
	t: TFunc
}

export function withAuth<P extends WithAuthProps>(
	WrappedComponent: React.ComponentType<P>,
) {
	type ComponentProps = Omit<P, keyof WithAuthProps> & {
		params: Promise<{ locale: Locale }>
	}

	return async function AuthenticatedComponent(props: ComponentProps) {
		const { params, ...restProps } = props
		const t = await getTranslations()
		const { locale } = await params
		const { session, user, tenant } = await authService.verify()
		// TODO: get pathname and use for redirect after sign in

		if (!session) {
			redirect({
				href: `/sign-in`,
				locale: locale,
			})
			return
		}

		return (
			<WrappedComponent
				// @ignore
				{...(restProps as any)}
				user={user}
				session={session}
				tenant={tenant}
				locale={locale}
				t={t}
			/>
		)
	}
}
