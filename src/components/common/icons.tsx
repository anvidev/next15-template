import { Home, Moon, Plus, Settings2, Sparkle, Sun } from "lucide-react";
import React from "react";

type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
	moon: (props: IconProps) => <Moon {...props} />,
	sun: (props: IconProps) => <Sun {...props} />,
	sparkle: (props: IconProps) => <Sparkle {...props} />,
	plus: (props: IconProps) => <Plus {...props} />,
	home: (props: IconProps) => <Home {...props} />,
	settings: (props: IconProps) => <Settings2 {...props} />,
}
