import { Verify } from "@/components/auth/verify"
import { Loader } from "@/components/common/loader"
import { redirect } from "@/i18n/navigation"
import { authService } from "@/service/auth/service"
import { Suspense } from "react"

export default async function Page({
	params
}: {
	params: Promise<{ locale: string, token: string }>
}) {
	const { locale, token } = await params
	const { session } = await authService.verify()

	if (session) {
		redirect({
			href: "/",
			locale
		})
	}

	const verificationPromise = authService.getVerification(token)

	return (
		<Suspense fallback={<Loader />}>
			<Verify promise={verificationPromise} />
		</Suspense>
	)
}
