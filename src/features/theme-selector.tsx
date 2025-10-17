"use client";

import { Check, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const THEMES: { label: string; value: string }[] = [
	{
		label: "Light",
		value: "light",
	},
	{
		label: "Dark",
		value: "dark",
	},
	{
		label: "System",
		value: "system",
	},
];

export const ThemeSelector = () => {
	const { theme: currentTheme, setTheme } = useTheme();
	const router = useRouter();

	const onClick = (theme: string) => {
		setTheme(theme);

		router.refresh();
	};

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className="gap-2 cursor-pointer">
				<SunMedium className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
				<div className="text-sm">
					Thème{" "}
					{currentTheme === "light"
						? "clair"
						: currentTheme === "dark"
						? "sombre"
						: currentTheme === "system"
						? "de l'appareil"
						: null}
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent>
				<div className="max-w-xs px-2 py-1.5 text-sm">
					Les paramètres ne s'appliquent qu'à ce navigateur
				</div>
				{THEMES.map((theme, index) => {
					const isActive = theme.value === currentTheme;

					return (
						<DropdownMenuItem
							key={index}
							className="flex cursor-pointer items-center gap-2 py-2"
							onClick={() => onClick(theme.value)}
						>
							<Check
								className={cn(
									"size-5 opacity-0",
									isActive && "opacity-100"
								)}
							/>
							<span>{theme.label}</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};
