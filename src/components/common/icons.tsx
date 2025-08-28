import { Check, ChevronsUpDown, Eclipse, Home, Languages, LogOut, MessageCircleQuestionMark, Moon, Plus, Settings2, Sparkle, Sun, User, Warehouse } from "lucide-react";
import React from "react";

type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
	moon: (props: IconProps) => <Moon {...props} />,
	sun: (props: IconProps) => <Sun {...props} />,
	sparkle: (props: IconProps) => <Sparkle {...props} />,
	plus: (props: IconProps) => <Plus {...props} />,
	home: (props: IconProps) => <Home {...props} />,
	settings: (props: IconProps) => <Settings2 {...props} />,
	languages: (props: IconProps) => <Languages {...props} />,
	help: (props: IconProps) => <MessageCircleQuestionMark {...props} />,
	logout: (props: IconProps) => <LogOut {...props} />,
	user: (props: IconProps) => <User {...props} />,
	upDownChevron: (props: IconProps) => <ChevronsUpDown {...props} />,
	eclipse: (props: IconProps) => <Eclipse {...props} />,
	warehouse: (props: IconProps) => <Warehouse {...props} />,
	check: (props: IconProps) => <Check {...props} />,
}
