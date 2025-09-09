import { env } from 'process';
import * as React from 'react';

interface EmailTemplateProps {
	environment: 'development' | 'production' | 'test'
	token: string
}

export function AcceptInvitation({ token, environment = 'development' }: EmailTemplateProps) {
	const verlUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	const port = env.PORT ?? 3000
	const verifyUrl = environment == 'production'
		? `https://${verlUrl}/invitation/${token}`
		: `http://localhost:${port}/invitation/${token}`

	return (
		<div>
			<h1>Du er blevet inviteret til PROJ_NAME</h1>
			<p>You can accept the invitation by following this link: <a href={verifyUrl} target='_blank'>accept invitation</a></p>
		</div>
	);
}
