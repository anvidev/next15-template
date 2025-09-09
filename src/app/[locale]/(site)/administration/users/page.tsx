import { DeleteUsersDialog } from '@/components/administration-users/delete-users-dialog'
import { InviteUsersDialog } from '@/components/administration-users/invite-users-dialog'
import { Table } from '@/components/administration-users/table'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { loadUsersSearchParams } from '@/schemas/auth'
import { authService } from '@/service/auth/service'
import { SearchParams } from 'nuqs'
import { Suspense } from 'react'

interface Props extends WithAuthProps {
	searchParams: Promise<SearchParams>;
}

async function UsersPage({ t, tenant, user, searchParams }: Props) {
	const filters = await loadUsersSearchParams(searchParams);
	console.log("filters", filters)
	const users = authService.listUsers(tenant.id, filters)
	return (
		<>
			<Page.Header>
				<Page.Title>{t('usersPage.title')}</Page.Title>
				<Page.Actions>
					<InviteUsersDialog />
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<main className='grow relative'>
					<Suspense fallback={<p>Loading users...</p>}>
						<Table user={user} promise={users} />
					</Suspense>
					<DeleteUsersDialog />
				</main>
			</Page.Content>
		</>
	)
}

export default withAuth(UsersPage)
