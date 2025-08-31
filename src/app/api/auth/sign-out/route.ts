import { tryCatch } from '@/lib/try-catch'
import { authService } from '@/service/auth/service'
import { NextRequest, NextResponse } from 'next/server'

// TODO: abstract api utils
export async function POST(r: NextRequest) {
	const { session } = await authService.verify()
	if (!session) {
		return NextResponse.json({ message: 'succes' }, { status: 403 })
	}

	await tryCatch(authService.invalidateSession(session.token))

	return NextResponse.json({ message: 'succes' }, { status: 200 })
}
