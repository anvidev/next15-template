'use client'

import { createResetRequestAction, signInAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Loader } from '../common/loader'
import { createResetRequestValidation } from '@/schemas/auth'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { ResetRequestType } from '@/store/auth/models'
import { Icons } from '../common/icons'

export function ForgotCredentials() {
	const tValidations = useTranslations("validations")
	const schema = createResetRequestValidation(tValidations)

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
			type: ResetRequestType.Password
		},
	})

	const { execute, isExecuting } = useAction(createResetRequestAction, {
		onError({ error }) {
			toast(error.serverError)
		},
		onSuccess() {
			toast('Welcome back!')
			form.reset()
		},
	})

	return (
		<Card className='w-full max-w-sm'>
			<CardHeader>
				<CardTitle>Forgot credentials</CardTitle>
				<CardDescription>
					Choose which provider to reset
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id='sign-in-form'
						onSubmit={form.handleSubmit(execute)}
						className='space-y-5'>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Provider</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex gap-3"
										>
											<div className="flex-1">
												<FormItem>
													<FormControl>
														<RadioGroupItem
															className='sr-only peer'
															value={ResetRequestType.Password}
															id="password-option"
														/>
													</FormControl>
													<FormLabel
														htmlFor="password-option"
														className="flex flex-col items-center justify-center gap-0.5 h-16 w-full rounded-lg border-2 bg-input/30 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary cursor-pointer transition-all duration-200 font-medium text-sm"
													>
														<Icons.password className='size-5' />
														<span className='text-xs font-semibold'>Password</span>
													</FormLabel>
												</FormItem>
											</div>
											<div className="flex-1">
												<FormItem>
													<FormControl>
														<RadioGroupItem
															className='sr-only peer'
															value={ResetRequestType.PIN}
															id="pin-option"
														/>
													</FormControl>
													<FormLabel
														htmlFor="pin-option"
														className="flex flex-col items-center justify-center gap-0.5 h-16 w-full rounded-lg border-2 bg-input/30 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary cursor-pointer transition-all duration-200 font-medium text-sm"
													>
														<Icons.pin className='size-5' />
														<span className='text-xs font-semibold'>PIN</span>
													</FormLabel>
												</FormItem>
											</div>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input type="email" autoComplete='email webauthn' placeholder='Your email...' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

					</form>
				</Form>
			</CardContent>
			<CardFooter className='flex-col gap-2'>
				<Button disabled={isExecuting} form='sign-in-form' type='submit' className='w-full'>
					{isExecuting && <Loader />}
					Send Reset Link
				</Button>
				<div className='mt-4 text-center text-sm'>
					Remember your credentials?{' '}
					<Link href='/sign-in' className='underline underline-offset-4'>
						Back to sign in
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}
