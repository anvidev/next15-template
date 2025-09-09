import { AcceptAndRegister } from "@/components/auth/accept-and-register"
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
	const invitationPromise = tryCatch(authService.getInvitation(token))
	return (
		<Suspense fallback={<Loader />}>
			<AcceptAndRegister promise={invitationPromise} />
		</Suspense>
	)
}
