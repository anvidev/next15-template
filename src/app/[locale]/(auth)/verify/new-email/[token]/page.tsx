import { Loader } from "@/components/common/loader"
import { authService } from "@/service/auth/service"
import { Suspense } from "react"

export default async function Page({
	params
}: {
	params: Promise<{ locale: string, token: string }>
}) {
	const { token } = await params
	const verificationPromise = authService.getVerification(token)

	return (
		<Suspense fallback={<Loader />}>
			<div>verify new email</div>
		</Suspense>
	)
}
