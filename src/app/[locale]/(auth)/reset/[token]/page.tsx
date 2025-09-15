
import { ResetCredentials } from "@/components/auth/reset-credentials"
import { Loader } from "@/components/common/loader"
import { authService } from "@/service/auth/service"
import { Suspense } from "react"

export default async function Page({
	params
}: {
	params: Promise<{ locale: string, token: string }>
}) {
	const { token } = await params
	const verificationPromise = authService.getResetRequest(token)

	return (
		<Suspense fallback={<Loader />}>
			<ResetCredentials promise={verificationPromise} />
		</Suspense>
	)
}
