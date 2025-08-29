import { Icons } from '@/components/common/icons'
import { Page } from '@/components/common/page'
import { withAuth, WithAuthProps } from '@/components/common/with-auth'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

async function Home({ user }: WithAuthProps) {
	const t = await getTranslations('home')
	return (
		<>
			<Page.Header>
				<Page.Title>{t('title')}</Page.Title>
				<Page.Actions>
					<Button size='icon' variant='ghost'>
						<Icons.plus />
					</Button>
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 grow'>
					<main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
						<pre>{JSON.stringify(user, null, 2)}</pre>
					</main>
				</div>
			</Page.Content>
		</>
	)
}

export default withAuth(Home)
