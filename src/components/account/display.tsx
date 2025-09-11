"use client"

import { User } from "@/store/auth/models"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { getInitials } from "@/lib/utils"
import { Button } from "../ui/button"
import { Icons } from "../common/icons"

interface Props {
	user: User
}

export function Display({ user }: Props) {
	return (
		<div className="w-full flex items-center gap-4 border p-3 shadow-sm bg-card rounded-lg">
			<Avatar className='size-12 rounded-lg'>
				<AvatarImage
					src={user.image as string}
					alt={user.name}
				/>
				<AvatarFallback className='rounded-lg uppercase'>{getInitials(user.name)}</AvatarFallback>
			</Avatar>
			<div>
				<p className="font-medium leading-tight">{user.name}</p>
				<p className="text-muted-foreground text-sm">{user.email}</p>
			</div>
			<Button
				size="icon"
				variant="ghost"
				className="ml-auto text-muted-foreground">
				<Icons.pencil />
			</Button>
		</div>
	)
}
