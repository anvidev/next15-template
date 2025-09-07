import { Verify } from "@/components/auth/verify"
import { Loader } from "@/components/common/loader"
import { tryCatch } from "@/lib/try-catch"
import { authService } from "@/service/auth/service"
import { Suspense } from "react"

export default async function Page({
	params
}: {
	params: Promise<{ token: string }>
}) {
	const { token } = await params
	const verificationPromise = tryCatch(authService.getVerification(token))
	return (
		<Suspense fallback={<Loader />}>
			<Verify promise={verificationPromise} />
		</Suspense>
	)
}
