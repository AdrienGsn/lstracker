"use client";

import {
	Calculator,
	Calendar,
	CreditCard,
	Search,
	Settings,
	Smile,
	User,
} from "lucide-react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import {
	ItemActions,
	ItemContent,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { CtrlOrMeta, Kbd } from "@/components/ui/kbd";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export const SearchButton = () => {
	const [open, setOpen] = useState(false);

	useHotkeys("meta+k", () => setOpen(!open));

	return (
		<SidebarMenuItem>
			<SidebarMenuButton onClick={() => setOpen(true)}>
				<ItemMedia>
					<Search className="size-4" />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>Rechercher...</ItemTitle>
				</ItemContent>
				<ItemActions>
					<Kbd>
						<CtrlOrMeta /> + K
					</Kbd>
				</ItemActions>
			</SidebarMenuButton>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Suggestions">
						<CommandItem>
							<Calendar />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<Smile />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem>
							<Calculator />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<User />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CreditCard />
							<span>Billing</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<Settings />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</SidebarMenuItem>
	);
};
