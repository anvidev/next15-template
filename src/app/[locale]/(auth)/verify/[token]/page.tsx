import { Verify, VerifyNotFound } from "@/components/auth/verify"
import { tryCatch } from "@/lib/try-catch"
import { authService } from "@/service/auth/service"

export default async function Page({
	params
}: {
	params: Promise<{ token: string }>
}) {
	const { token } = await params
	const verificationRes = await tryCatch(authService.getVerification(token))
	return verificationRes.success
		? <Verify verification={verificationRes.data} />
		: <VerifyNotFound />
}
