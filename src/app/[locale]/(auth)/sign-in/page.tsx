'use client'

import { signIn, signUp } from '@/server/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Page() {
	const router = useRouter()
	async function signInHandler() {
		await signIn()
		toast('Welcome back!')
		router.replace('/')
	}

	return (
		<>
			<p>page</p>
			<button onClick={signUp}>Sign up</button>
			<button onClick={signInHandler}>Sign in</button>
		</>
	)
}
