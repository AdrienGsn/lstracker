"use client";

import { Marker, Team } from "@prisma/client";
import {
	Home,
	LucideIcon,
	Pin,
	Search,
	Settings,
	TriangleAlert,
	User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { authClient } from "@/lib/auth/client";
import { AuthPermission, AuthRole, RolesKeys } from "@/lib/auth/permissions";

type SearchNavigationAccessControl = {
	roles?: AuthRole[];
	permissions?: AuthPermission;
};

type SearchNavigationItem = SearchNavigationAccessControl & {
	icon: LucideIcon;
	label: string;
	hotkey?: string;
	href?: string;
};

type SearchNavigationGroup = SearchNavigationAccessControl & {
	label?: string;
	items: SearchNavigationItem[];
};

const SEARCH_NAVIGATION: SearchNavigationGroup[] = [
	{
		label: "Navigation",
		items: [
			{
				icon: Home,
				label: "Accueil",
				href: "/",
			},
		],
	},
	{
		label: "Parametres",
		items: [
			{
				icon: Settings,
				label: "General",
				href: "/settings",
			},
			{
				icon: Settings,
				label: "Membres",
				href: "/settings/members",
			},
			{
				icon: Settings,
				label: "Equipes",
				href: "/settings/teams",
			},
			{
				icon: TriangleAlert,
				label: "Danger Zone",
				href: "/settings/danger",
				roles: ["owner"],
			},
		],
		roles: ["admin", "owner"],
	},
];

const isAuthRole = (role?: string | null): role is AuthRole => {
	if (!role) {
		return false;
	}

	return (RolesKeys as readonly string[]).includes(role);
};

const canAccessNavigationEntity = (
	role: AuthRole | undefined,
	entity?: SearchNavigationAccessControl
) => {
	const requiredRoles = entity?.roles;
	const requiredPermissions = entity?.permissions;

	if (!requiredRoles && !requiredPermissions) {
		return true;
	}

	if (!role) {
		return false;
	}

	if (requiredRoles && !requiredRoles.includes(role)) {
		return false;
	}

	if (!requiredPermissions) {
		return true;
	}

	return authClient.organization.checkRolePermission({
		role,
		permissions: requiredPermissions,
	});
};

const filterNavigationGroups = (
	groups: SearchNavigationGroup[],
	role: AuthRole | undefined
) => {
	return groups.reduce<SearchNavigationGroup[]>((accumulator, group) => {
		if (!canAccessNavigationEntity(role, group)) {
			return accumulator;
		}

		const accessibleItems = group.items.filter((item) =>
			canAccessNavigationEntity(role, item)
		);

		if (accessibleItems.length === 0) {
			return accumulator;
		}

		accumulator.push({ ...group, items: accessibleItems });

		return accumulator;
	}, []);
};

export type SearchButtonProps = {
	teams: Team[];
	markers: Marker[];
};

export const SearchButton = (props: SearchButtonProps) => {
	const router = useRouter();
	const { data: activeMember } = authClient.useActiveMember();

	const activeRole = useMemo(
		() => (isAuthRole(activeMember?.role) ? activeMember?.role : undefined),
		[activeMember?.role]
	);

	const navigationGroups = useMemo(
		() => filterNavigationGroups(SEARCH_NAVIGATION, activeRole),
		[activeRole]
	);

	const [open, setOpen] = useState(false);

	useHotkeys("mod+k", () => setOpen(!open));

	return (
		<>
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
			</SidebarMenuItem>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Type a command or search..." />
				<CommandList>
					<CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
					{props.teams.length > 0 ? (
						<div>
							<CommandGroup heading="Equipes">
								{props.teams.map((team) => {
									return (
										<CommandItem key={team.id}>
											<User2 />
											<span>{team.name}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandSeparator />
						</div>
					) : null}
					{props.markers.length > 0 ? (
						<>
							<CommandGroup heading="Marqueurs">
								{props.markers.map((marker) => {
									return (
										<CommandItem key={marker.id}>
											<Pin />
											<span>{marker.label}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandSeparator />
						</>
					) : null}
					{navigationGroups.map((group, index) => {
						const groupKey = `${group.label ?? "group"}-${index}`;
						const showSeparator =
							index < navigationGroups.length - 1;

						return (
							<div key={groupKey}>
								<CommandGroup heading={group.label}>
									{group.items.map((item) => {
										const itemKey = item.href ?? item.label;

										return (
											<CommandItem
												key={itemKey}
												onSelect={() => {
													if (item.href) {
														router.push(item.href);
													}
												}}
											>
												<item.icon />
												<span>{item.label}</span>
												{item.hotkey ? (
													<CommandShortcut>
														⌘{item.hotkey}
													</CommandShortcut>
												) : null}
											</CommandItem>
										);
									})}
								</CommandGroup>
								{showSeparator ? <CommandSeparator /> : null}
							</div>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};
