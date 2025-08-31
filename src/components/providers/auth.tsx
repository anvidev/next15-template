"use client"

import { tryCatch } from "@/lib/try-catch";
import { Session, Tenant, User } from "@/store/auth/models";
import { createContext, PropsWithChildren, useContext } from "react";

export type AuthContextValue = {
	isAuthenticated: true
	session: Session
	user: User
	tenant: Tenant
	signOut: () => Promise<void>
} | {
	isAuthenticated: false
	session: null
	user: null
	tenant: null
	signOut: () => Promise<void>
}

type Props = {
	session: Session | null
	user: User | null
	tenant: Tenant | null
}

const AuthContext = createContext<AuthContextValue>({
	isAuthenticated: false,
	session: null,
	user: null,
	tenant: null,
	signOut: async () => { }
})

export default function AuthProvider({ children, ...value }: PropsWithChildren<Props>) {
	async function signOut() {
		try {
			await fetch("/api/auth/sign-out", {
				method: 'post',
			})
		} catch (err) {
			console.error(err)
		}
	}

	const isAuthenticated = !!(value.session && value.user && value.tenant)

	const contextValue: AuthContextValue = isAuthenticated
		? {
			isAuthenticated: true,
			session: value.session!,
			user: value.user!,
			tenant: value.tenant!,
			signOut
		}
		: {
			isAuthenticated: false,
			session: null,
			user: null,
			tenant: null,
			signOut
		}

	return (
		<AuthContext.Provider value={contextValue}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
