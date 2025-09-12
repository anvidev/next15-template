import { VerificationType } from '@/store/auth/models';
import { env } from 'process';
import * as React from 'react';

interface EmailTemplateProps {
	environment: 'development' | 'production' | 'test'
	token: string
	type: VerificationType
}

export function ResetAccountProvider({ type, token, environment = 'development' }: EmailTemplateProps) {
	const verlUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	const port = env.PORT ?? 3000
	const resetUrl = environment == 'production'
		? `https://${verlUrl}/reset/${type}/${token}`
		: `http://localhost:${port}/reset/${type}/${token}`

	return (
		<div>
			<h1>We have received a request to reset your {type} provider</h1>
			<p>You can reset your {type} by following this link: <a href={resetUrl} target='_blank'>reset</a></p>
		</div>
	);
}
