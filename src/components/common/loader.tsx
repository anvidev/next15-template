import { Icons } from "@/components/common/icons";
import { cn } from "@/lib/utils";

export function Loader({ className, ...props }: React.HTMLAttributes<SVGElement>) {
	return <Icons.loader className={cn("size-4 animate-spin", className)}  {...props} />
}
