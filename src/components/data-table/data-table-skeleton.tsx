"use client"

import { Skeleton } from "../ui/skeleton"

export function DataTableSkeleton() {
	return (

		<div className="flex w-full flex-col gap-4">
			<div className="flex w-full items-start justify-between gap-2">
				<div className="flex flex-1 flex-wrap items-center gap-2">
					<Skeleton className="size-8" />
					<Skeleton className="h-8 w-[102px]" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-[102px]" />
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
			<Skeleton className="w-full h-48" />
			<div className="flex">
				<div className="mr-auto hidden md:block">
					<Skeleton className="h-5 w-28" />
				</div>
				<div className="md:ml-auto flex items-center justify-between md:justify-end md:gap-4 w-full lg:gap-8">
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-28 hidden md:block" />
						<Skeleton className="h-8 w-[76px]" />
					</div>
					<div className="flex items-center gap-2">
						<Skeleton className="h-5 w-[66px]" />
						<div className="flex items-center gap-2">
							<Skeleton className="size-8 hidden lg:block" />
							<Skeleton className="size-8 hidden lg:block" />
							<Skeleton className="size-8" />
							<Skeleton className="size-8" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
