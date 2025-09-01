"use client"

import { tryCatch } from "@/lib/try-catch";
import { Session, Tenant, User } from "@/store/auth/models";
import { createContext, PropsWithChildren, useContext } from "react";

export type AuthContextValue = {
	isAuthenticated: true
	session: Session
	user: User
	tenant: Tenant
	signOut: () => Promise<boolean>
} | {
	isAuthenticated: false
	session: null
	user: null
	tenant: null
	signOut: () => Promise<boolean>
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
	signOut: async () => { return false }
})

export default function AuthProvider({ children, ...value }: PropsWithChildren<Props>) {
	async function signOut() {
		try {
			await fetch("/api/auth/sign-out", {
				method: 'post',
			})
			return true
		} catch (err) {
			console.error(err)
			return false
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
