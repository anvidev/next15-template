import { env } from 'process';
import * as React from 'react';

interface EmailTemplateProps {
	environment: 'development' | 'production' | 'test'
	name: string;
	token: string
}

export function EmailTemplate({ name, token, environment = 'development' }: EmailTemplateProps) {
	const verlUrl = env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	const port = env.PORT ?? 3000
	const verifyUrl = environment == 'production'
		? `https://${verlUrl}/verify/${token}`
		: `http://localhost:${port}/verify/${token}`

	return (
		<div>
			<h1>Welcome, {name}!</h1>
			<p>Please verify your email by following this link: <a href={verifyUrl} target='_blank'>verify your email</a></p>
		</div>
	);
}
