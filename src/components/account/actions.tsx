"use client"

import { authService } from "@/service/auth/service"
import { Icons } from "../common/icons"
import { Button } from "../ui/button"
import { use, useState } from "react"
import { Input } from "../ui/input"
import { AccountAccordion } from "./accordion"
import { useAction } from "next-safe-action/hooks"
import {
	changeOwnPasswordAction,
	changeOwnPinAction,
	createPasswordAction,
	createPinAction,
	deleteOwnUserAction
} from "@/actions/auth"
import { toast } from "sonner"
import { Loader } from "../common/loader"
import { useRouter } from "@/i18n/navigation"
import { Skeleton } from "../ui/skeleton"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import {
	changePasswordValidation,
	changePinValidation,
	createPasswordValidation,
	createPinValidation
} from "@/schemas/auth"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "../ui/form"

interface Props {
	promise: Promise<Awaited<ReturnType<typeof authService.listAccountUses>>>
}

export function Actions({ promise }: Props) {
	const accountUsage = use(promise)
	const tActionsPage = useTranslations("accountPage")

	return (
		<>
			<div className="space-y-3">
				<p className="text-muted-foreground font-medium text-sm">{tActionsPage("actionsTitleOne")}</p>
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<EmailAccordion />
					<PasswordAccordions active={accountUsage.credential} />
					<PinAccordions active={accountUsage.pin} />
				</div>
			</div>
			<div className="space-y-3">
				<p className="text-muted-foreground font-medium text-sm">{tActionsPage("actionsTitleTwo")}</p>
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<DangerAccordions />
				</div>
			</div>
		</>
	)
}

function EmailAccordion() {
	const tAccountPage = useTranslations("accountPage")
	return (
		<AccountAccordion
			title={tAccountPage("emailAccordion.title")}
			description={tAccountPage("emailAccordion.description")}
			leftIcon={Icons.email}>
			<p className="text-sm text-muted-foreground">{tAccountPage("emailAccordion.textOne")}</p>
			<p className="text-sm text-muted-foreground">{tAccountPage("emailAccordion.textTwo")}</p>
		</AccountAccordion>
	)
}

function PasswordAccordions({ active }: { active: boolean }) {
	const tAccountPage = useTranslations("accountPage")
	const tValidations = useTranslations("validations")
	const changeSchema = changePasswordValidation(tValidations)
	const createSchema = createPasswordValidation(tValidations)

	const changeForm = useForm<z.infer<typeof changeSchema>>({
		resolver: zodResolver(changeSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		}
	})
	const { execute: changePassword, isExecuting: isChangingPassword } = useAction(changeOwnPasswordAction, {
		onError() {
			toast("Adgangskode blev ikke skiftet")
		},
		onSuccess() {
			toast("Adgangskode blev skiftet")
			changeForm.reset()
		},
	})

	const createForm = useForm<z.infer<typeof createSchema>>({
		resolver: zodResolver(createSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		}
	})
	const { execute: createPassword, isExecuting: isCreatingPassword } = useAction(createPasswordAction, {
		onError() {
			toast("Adgangskode blev ikke skiftet")
		},
		onSuccess() {
			toast("Adgangskode blev skiftet")
			createForm.reset()
		},
	})

	return active ? (
		<AccountAccordion
			title={tAccountPage("passwordAccordion.updateTitle")}
			description={tAccountPage("passwordAccordion.updateDescription")}
			leftIcon={Icons.password}>
			<p className="text-sm text-muted-foreground">
				{tAccountPage("passwordAccordion.updateTextOne")}
			</p>

			<Form {...changeForm}>
				<form
					onSubmit={changeForm.handleSubmit(changePassword)}
					className="flex flex-col items-center gap-3">
					<FormField
						control={changeForm.control}
						name="currentPassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("passwordAccordion.currentPassword")}
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										disabled={isChangingPassword}
										placeholder={tAccountPage("passwordAccordion.currentPasswordPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={changeForm.control}
						name="newPassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("passwordAccordion.newPassword")}
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										disabled={isChangingPassword}
										placeholder={tAccountPage("passwordAccordion.newPasswordPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={changeForm.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("passwordAccordion.confirmPassword")}
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										disabled={isChangingPassword}
										placeholder={tAccountPage("passwordAccordion.confirmPasswordPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className="w-full"
						disabled={isChangingPassword}>
						{isChangingPassword && <Loader />}
						{tAccountPage("passwordAccordion.updateButton")}
					</Button>
				</form>
			</Form>
		</AccountAccordion>
	) : (
		<AccountAccordion
			title={tAccountPage("passwordAccordion.createTitle")}
			description={tAccountPage("passwordAccordion.createDescription")}
			leftIcon={Icons.password}>
			<p className="text-sm text-muted-foreground">
				{tAccountPage("passwordAccordion.createTextOne")}
			</p>

			<Form {...createForm}>
				<form
					onSubmit={createForm.handleSubmit(createPassword)}
					className="flex flex-col items-center gap-3">
					<FormField
						control={createForm.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("passwordAccordion.password")}
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										disabled={isCreatingPassword}
										placeholder={tAccountPage("passwordAccordion.passwordPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={createForm.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("passwordAccordion.confirmPassword")}
								</FormLabel>
								<FormControl>
									<Input
										type="password"
										disabled={isCreatingPassword}
										placeholder={tAccountPage("passwordAccordion.confirmPasswordPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className="w-full"
						disabled={isCreatingPassword}>
						{isCreatingPassword && <Loader />}
						{tAccountPage("passwordAccordion.createButton")}
					</Button>
				</form>
			</Form>
		</AccountAccordion>
	)
}

function PinAccordions({ active }: { active: boolean }) {
	const tAccountPage = useTranslations("accountPage")
	const tValidations = useTranslations("validations")
	const changeSchema = changePinValidation(tValidations)
	const createSchema = createPinValidation(tValidations)

	const changeForm = useForm<z.infer<typeof changeSchema>>({
		resolver: zodResolver(changeSchema),
		defaultValues: {
			currentPin: "" as unknown as number,
			newPin: "" as unknown as number,
			confirmPin: "" as unknown as number,
		}
	})
	const { execute: changePin, isExecuting: isChangingPin } = useAction(changeOwnPinAction, {
		onError() {
			toast("PIN-kode blev ikke skiftet")
		},
		onSuccess() {
			toast("PIN-kode blev skiftet")
			changeForm.reset()
		},
	})

	const createForm = useForm<z.infer<typeof createSchema>>({
		resolver: zodResolver(createSchema),
		defaultValues: { pin: "" as unknown as number }
	})
	const { execute: createPin, isExecuting: isCreatingPin } = useAction(createPinAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else if (error.validationErrors) {
				toast(error.validationErrors.pin)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("successToast")
			createForm.reset()
		},
	})

	return active ? (
		<AccountAccordion
			title={tAccountPage("pinAccordion.updateTitle")}
			description={tAccountPage("pinAccordion.updateDescription")}
			leftIcon={Icons.pin}>
			<p className="text-sm text-muted-foreground">
				{tAccountPage("pinAccordion.updateTextOne")}
			</p>

			<Form {...changeForm}>
				<form
					onSubmit={changeForm.handleSubmit(changePin)}
					className="flex flex-col items-center gap-3">
					<FormField
						control={changeForm.control}
						name="currentPin"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("pinAccordion.currentPin")}
								</FormLabel>
								<FormControl>
									<Input
										disabled={isCreatingPin}
										placeholder={tAccountPage("pinAccordion.currentPinPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={changeForm.control}
						name="newPin"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("pinAccordion.newPin")}
								</FormLabel>
								<FormControl>
									<Input
										disabled={isCreatingPin}
										placeholder={tAccountPage("pinAccordion.newPinPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={changeForm.control}
						name="confirmPin"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>
									{tAccountPage("pinAccordion.confirmPin")}
								</FormLabel>
								<FormControl>
									<Input
										disabled={isCreatingPin}
										placeholder={tAccountPage("pinAccordion.confirmPinPlaceholder")}
										{...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className="w-full"
						disabled={isChangingPin}>
						{isChangingPin && <Loader />}
						{tAccountPage("pinAccordion.updateButton")}
					</Button>
				</form>
			</Form>
		</AccountAccordion>
	) : (
		<AccountAccordion
			title="Opret PIN-kode"
			description="Vælg en 4-cifret kode"
			leftIcon={Icons.pin}>
			<p className="text-sm text-muted-foreground">
				{tAccountPage("pinAccordion.createTextOne")}
			</p>

			<Form {...createForm}>
				<form
					onSubmit={createForm.handleSubmit(createPin)}
					className="flex flex-col items-center gap-2">
					<FormField
						control={createForm.control}
						name="pin"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>{tAccountPage("pinAccordion.pin")}</FormLabel>
								<FormControl>
									<Input
										disabled={isCreatingPin}
										placeholder={tAccountPage("pinAccordion.pinPlaceholder")}
										{...field} />
								</FormControl>
								<FormDescription>
									{tAccountPage("pinAccordion.pinDescription")}
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className="w-full"
						disabled={createForm.watch('pin', 0).toString().length !== 4 || isCreatingPin}>
						{isCreatingPin && <Loader />}
						{tAccountPage("pinAccordion.createButton")}
					</Button>
				</form>
			</Form>
		</AccountAccordion>
	)
}

function DangerAccordions() {
	const tAccountPage = useTranslations("accountPage")
	const router = useRouter()
	const [value, setValue] = useState("")

	const { execute, isExecuting } = useAction(deleteOwnUserAction, {
		onError({ error }) {
			if (error.serverError) {
				toast(error.serverError)
			} else {
				toast("unknownError")
			}
		},
		onSuccess() {
			toast("Konto slettet")
			router.replace("/sign-in")
		},
	})

	return (
		<AccountAccordion
			title={tAccountPage("dangerAccordion.title")}
			description={tAccountPage("dangerAccordion.description")}
			leftIcon={Icons.trash}>
			<p className="text-sm text-muted-foreground">
				{tAccountPage("dangerAccordion.textOne")}
			</p>

			<p className="text-sm text-muted-foreground">
				{tAccountPage.rich("dangerAccordion.textTwo", {
					strong: (chunks) => <strong>{chunks}</strong>
				})}
			</p>

			<div className="flex items-center gap-2">
				<Input disabled={isExecuting} value={value} onChange={e => setValue(e.target.value)} />
				<Button
					variant="destructive"
					disabled={value.toLowerCase() !== "slet konto" || isExecuting}
					onClick={() => execute()}>
					{isExecuting && <Loader />}
					{tAccountPage("dangerAccordion.deleteButton")}
				</Button>
			</div>
		</AccountAccordion>
	)
}

export function ActionsSkeleton() {
	return (
		<>
			<div className="space-y-3">
				<Skeleton className="h-5 w-16" />
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<Skeleton className="w-full h-52" />
				</div>
			</div>
			<div className="space-y-3">
				<Skeleton className="h-5 w-16" />
				<div className="w-full space-y-1 border p-1 shadow-sm bg-card rounded-lg">
					<Skeleton className="w-full h-20" />
				</div>
			</div>
		</>
	)
}
