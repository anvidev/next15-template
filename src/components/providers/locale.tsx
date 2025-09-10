"use client"

import { Locale } from "@/i18n/routing"
import { createContext, PropsWithChildren, useContext } from "react"

type LocaleContextValue = {
	locale: Locale
}

const LocaleContext = createContext<LocaleContextValue>({ locale: 'en' })

interface Props {
	locale: Locale
}

export function LocaleProvider({ children, locale }: PropsWithChildren<Props>) {
	return (
		<LocaleContext.Provider value={{ locale }}>
			{children}
		</LocaleContext.Provider>
	)
}

export function useLocale() {
	return useContext(LocaleContext)
}
