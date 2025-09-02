import { Resend } from 'resend'
import { env } from './env'

export const FROM = 'Next Template <noreply@nemunivers.app>'

export const resend = new Resend(env.RESEND_KEY)
