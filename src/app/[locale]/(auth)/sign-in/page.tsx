import { SignInForm } from '@/components/auth/sign-in-form'
import { redirect } from '@/i18n/navigation'
import { authService } from '@/service/auth/service'

export default async function Page({ params }: Readonly<{
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

	return <SignInForm />
}
