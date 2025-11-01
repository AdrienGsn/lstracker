"use client";

import { Check, Home, Plus, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
	Sidebar as SidebarComp,
	SidebarContent,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/logger";
import { NavigationGroup } from "@/types/navigation";
import { OrgDropdown } from "./org-dropdown";
import { SearchButton } from "./search-button";

const NAVIGATION: NavigationGroup[] = [
	{
		links: [
			{
				type: "LINK",
				icon: User,
				label: "links.dashboard",
				href: "/dashboard",
			},
			{
				type: "COLLAPSIBLE",
				icon: Settings,
				label: "links.settings.index",
				href: "/settings",
				subLinks: [
					{
						label: "links.settings.general",
						href: "",
					},
					{
						label: "links.settings.members",
						href: "",
					},
					{
						label: "links.settings.billing",
						href: "",
					},
				],
			},
		],
	},
];

export const MainSidebar = () => {
	const { state } = useSidebar();
	const pathname = usePathname();
	const router = useRouter();
	const { user, session } = useCurrentUser();
	const [teams, setTeams] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const hasPermissionCreateTeam = authClient.organization.checkRolePermission(
		{
			permission: { team: ["create"] },
			role: "admin",
		}
	);

	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const { data } = await authClient.organization.listUserTeams();

				setTeams(data || []);
			} catch (error) {
				logger.error("Erreur lors du chargement des équipes:", error);

				setTeams([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTeams();
	}, []);

	return (
		<SidebarComp variant="inset" collapsible="icon">
			<SidebarHeader>
				<OrgDropdown />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SearchButton />
							<SidebarMenuButton asChild>
								<Link href="">
									<Home />
									Accueil
								</Link>
							</SidebarMenuButton>
							<SidebarMenuButton asChild>
								<Link href="">
									<Settings />
									Paramètres
								</Link>
							</SidebarMenuButton>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{!isLoading &&
				((teams && teams.length > 0) || hasPermissionCreateTeam) ? (
					<SidebarGroup>
						<SidebarGroupLabel>Team</SidebarGroupLabel>
						{hasPermissionCreateTeam ? (
							<SidebarGroupAction>
								<Plus />
							</SidebarGroupAction>
						) : null}
						<SidebarGroupContent>
							<SidebarMenu>
								{teams.map((team) => (
									<SidebarMenuItem key={team.id}>
										<SidebarMenuButton
											onClick={() => {
												authClient.organization.setActiveTeam(
													{ teamId: team.id }
												);

												router.refresh();
											}}
										>
											{team.name}
										</SidebarMenuButton>
										{session?.activeTeamId === team.id ? (
											<SidebarMenuAction>
												<Check />
											</SidebarMenuAction>
										) : null}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				) : null}
			</SidebarContent>
		</SidebarComp>
	);
};
