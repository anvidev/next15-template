import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { Button } from '@/components/ui/button'

async function UsersPage({ t, user }: WithAuthProps) {
	return (
		<>
			<Page.Header>
				<Page.Title>{t('usersPage.title')}</Page.Title>
				<Page.Actions>
					<Button
						size='icon'
						variant='ghost'
						tooltip="Inviter en bruger"
						className='size-7'>
						<Icons.plus />
					</Button>
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 grow'>
					<main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
						administration/users
					</main>
				</div>
			</Page.Content>
		</>
	)
}

export default withAuth(UsersPage)
