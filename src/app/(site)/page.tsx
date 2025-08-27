import { Icons } from "@/components/common/icons";
import { Page } from "@/components/common/page";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	return (
		<>
			<Page.Header>
				<Page.Title>Home</Page.Title>
				<Page.Actions>
					<Button size="icon" variant="ghost">
						<Icons.plus />
					</Button>
					<Separator
						orientation="vertical"
						className="data-[orientation=vertical]:h-5"
					/>
					<ThemeToggle />
				</Page.Actions>
			</Page.Header>
			<Page.Content>
				<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 grow">
					<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
						<pre>{JSON.stringify(session, null, 2)}</pre>
					</main>
				</div>
			</Page.Content>
		</>
	);
}
