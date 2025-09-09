import { resend } from '@/lib/resend'
import React from 'react'
import { ErrorResponse } from 'resend'

const FROM = 'Next Template <noreply@nemunivers.app>'
const MAX_ATTEMPTS = 5
const WAIT_MS = 1000
const MAX_WAIT = 60000 / MAX_ATTEMPTS

type Attachment =
	| {
			content: string
			filename: string
	  }
	| {
			path: string
			filename: string
	  }

export const emailService = {
	sendOnce: async function (
		to: string[],
		subject: string,
		comp: React.ReactElement,
	): Promise<ErrorResponse | null> {
		const { error } = await resend.emails.send({
			from: FROM,
			to: to,
			subject: subject,
			react: comp,
		})
		return error
	},
	sendRecursively: async function (
		to: string[],
		subject: string,
		comp: React.ReactElement,
		attachments: Attachment[] = [],
		attempt: number = 0,
		waitMs: number = WAIT_MS,
	): Promise<ErrorResponse | undefined> {
		const { error } = await resend.emails.send({
			from: FROM,
			to: to,
			subject: subject,
			react: comp,
			attachments: attachments,
		})

		if (error) {
			if (attempt >= MAX_ATTEMPTS) {
				console.error(`Failed to send email recursively after max attempts`)
				return error
			} else {
				const nextWaitMs = Math.min(waitMs * 2, MAX_WAIT)
				const nextAttempt = attempt + 1
				setTimeout(
					() =>
						this.sendRecursively(
							to,
							subject,
							comp,
							attachments,
							nextAttempt,
							nextWaitMs,
						),
					waitMs,
				)
			}
		} else {
			console.log(`Email send successfully after ${attempt} attempts`)
		}
	},
}
