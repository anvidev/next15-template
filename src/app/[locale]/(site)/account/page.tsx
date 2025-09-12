import { Actions, ActionsSkeleton } from '@/components/account/actions'
import { Display } from '@/components/account/display'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { authService } from '@/service/auth/service'
import { Suspense } from 'react'

async function AccountPage({ user, t }: WithAuthProps) {
	const accountUsagePromise = authService.listAccountUses(user.id)

	return (
		<>
			<Page.Header>
				<Page.Title>{t('accountPage.title')}</Page.Title>
			</Page.Header>
			<Page.Content>
				<main className='grow max-w-xl mx-auto w-full space-y-8'>
					<Display user={user} />
					<Suspense fallback={<ActionsSkeleton />}>
						<Actions promise={accountUsagePromise} />
					</Suspense>
				</main>
			</Page.Content>
		</>
	)
}

export default withAuth(AccountPage)
