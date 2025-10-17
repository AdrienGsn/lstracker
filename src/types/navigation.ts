import { LucideIcon } from "lucide-react";

export type NavigationLink =
	| {
			type: "LINK";
			icon?: LucideIcon;
			label: string;
			href: string;
			admin?: boolean;
	  }
	| {
			type: "COLLAPSIBLE";
			icon?: LucideIcon;
			label: string;
			href: string;
			isLink?: boolean;
			subLinks: { icon?: LucideIcon; label: string; href: string }[];
			isActive?: boolean;
			admin?: boolean;
	  };

export type NavigationGroup = {
	label?: string;
	links: NavigationLink[];
	admin?: boolean;
};
