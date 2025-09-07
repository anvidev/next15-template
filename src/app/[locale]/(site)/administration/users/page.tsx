import { Table } from '@/components/administration-users/table'
import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { Button } from '@/components/ui/button'
import { loadUsersSearchParams } from '@/schemas/search-params/users'
import { authService } from '@/service/auth/service'
import { SearchParams } from 'nuqs'
import { Suspense } from 'react'

interface Props extends WithAuthProps {
	searchParams: Promise<SearchParams>;
}

async function UsersPage({ t, tenant, searchParams }: Props) {
	const filters = await loadUsersSearchParams(searchParams);
	console.log("filters", filters)
	const users = authService.listUsers(tenant.id)
	return (
		<>
			<Page.Header>
				<Page.Title>{t('usersPage.title')}</Page.Title>
				<Page.Actions>
					<Button
						size='icon'
						variant='ghost'
						className='size-7'>
						<Icons.plus />
					</Button>
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<main className='grow relative'>
					<Suspense fallback={<p>Loading users...</p>}>
						<Table promise={users} />
					</Suspense>
				</main>
			</Page.Content>
		</>
	)
}

export default withAuth(UsersPage)
