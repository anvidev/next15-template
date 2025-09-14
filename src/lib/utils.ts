import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(
	date: Date | string,
	options?: Intl.DateTimeFormatOptions,
): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	return new Intl.DateTimeFormat('da-DK', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		...options,
	}).format(dateObj)
}

export function formatRelativeTime(date: Date | string): string {
	const dateObj = typeof date === 'string' ? new Date(date) : date
	const now = new Date()
	const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

	if (diffInSeconds < 60) return 'just now'
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
	if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
	if (diffInSeconds < 2592000)
		return `${Math.floor(diffInSeconds / 86400)}d ago`
	if (diffInSeconds < 31536000)
		return `${Math.floor(diffInSeconds / 2592000)}mo ago`
	return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number): string {
	if (str.length <= length) return str
	return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

export function generateRandomString(
	length: number,
	prefix = '',
	suffix = '',
): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return prefix + result + suffix
}

export function formatNumber(num: number): string {
	return new Intl.NumberFormat('en-US').format(num)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(amount)
}

export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return (
		Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
	)
}

export function getInitials(name: string) {
	const parts = name.split(' ')
	let initials = ''
	for (let i = 0; i < parts.length; i++) {
		if (parts[i].length > 0 && parts[i] !== '') {
			initials += parts[i][0]
		}
	}
	return initials.slice(0,2)
}

export function sleep(ms: number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}
