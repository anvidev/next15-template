import { auth } from "@/lib/auth"
import { Session, User } from "better-auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"

export type WithAuthProps = {
	user: User
	session: Session
	pathname: string
}

export function withAuth<P extends WithAuthProps>(
	WrappedComponent: React.ComponentType<P>,
) {
	return async function AuthenticatedComponent(props: Omit<P, keyof WithAuthProps>) {
		const session = await auth.api.getSession({ headers: await headers() })
		const pathname = (await headers()).get("x-current-path")

		if (!session) {
			redirect(`/sign-in?redirect=${pathname}`)
		}


		return (
			<WrappedComponent
				{...(props as P)}
				user={session.user}
				session={session.session}
				pathname={pathname}
			/>
		)
	}
}
