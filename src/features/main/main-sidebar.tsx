"use client";

import { Marker, Team } from "@prisma/client";
import { Check, ChevronRight, Home, Settings, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTeamAction } from "@/actions/organization/team/delete";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	Sidebar as SidebarComp,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/client";
import { dialog } from "@/providers/dialog-provider";
import { CreateTeamSidebarAction } from "./create-team-sidebar-action";
import { OrgDropdown } from "./org-dropdown";
import { SearchButton } from "./search-button";

export type MainSidebarProps = {
	teams: Team[];
	activeTeamId?: string;
	markers: Marker[];
};

export function MainSidebar(props: MainSidebarProps) {
	const { state } = useSidebar();
	const pathname = usePathname();
	const router = useRouter();

	const { data: member } = authClient.useActiveMember();

	const { executeAsync: deleteTeam, isPending: deleteTeamPending } =
		useAction(deleteTeamAction, {
			onSuccess: () => {
				toast.success("L'équipe a été supprimée avec succès");
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		});

	return (
		<SidebarComp variant="inset" collapsible="icon">
			<SidebarHeader>
				<OrgDropdown />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SearchButton
								teams={props.teams}
								markers={props.markers}
							/>
							<SidebarMenuButton asChild>
								<Link href="/">
									<Home />
									Accueil
								</Link>
							</SidebarMenuButton>
							{member?.role === "admin" ||
							member?.role === "owner" ? (
								<Collapsible
									asChild
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip="Paramètres"
												isActive={pathname.startsWith(
													"/settings"
												)}
											>
												<Settings />
												Paramètres
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												<SidebarMenuSubItem>
													<SidebarMenuSubButton
														isActive={
															pathname ===
															"/settings"
														}
														asChild
													>
														<Link href="/settings">
															General
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
												<SidebarMenuSubItem>
													<SidebarMenuSubButton
														isActive={
															pathname ===
															"/settings/teams"
														}
														asChild
													>
														<Link href="/settings/teams">
															Equipes
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
												<SidebarMenuSubItem>
													<SidebarMenuSubButton
														isActive={
															pathname ===
															"/settings/members"
														}
														asChild
													>
														<Link href="/settings/members">
															Membres
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
												{member?.role === "owner" ? (
													<SidebarMenuSubItem>
														<SidebarMenuSubButton
															isActive={
																pathname ===
																"/setting/dangers"
															}
															asChild
														>
															<Link href="/settings/danger">
																Danger Zone
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												) : null}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							) : null}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{props.teams && props.teams.length > 0 ? (
					<SidebarGroup>
						<SidebarGroupLabel>Equipes</SidebarGroupLabel>
						{member?.role === "admin" ||
						member?.role === "owner" ? (
							<CreateTeamSidebarAction />
						) : null}
						<SidebarGroupContent>
							<SidebarMenu>
								{props.teams.map((team) => (
									<ContextMenu key={team.id}>
										<ContextMenuTrigger asChild>
											<SidebarMenuItem>
												<SidebarMenuButton
													onClick={async () => {
														await authClient.organization.setActiveTeam(
															{
																teamId:
																	props.activeTeamId ===
																	team.id
																		? null
																		: team.id,
															}
														);

														if (
															typeof window !==
															"undefined"
														) {
															window.location.reload();
														}
													}}
												>
													<span className="truncate max-w-2/3">
														{team.name}
													</span>
													{props.activeTeamId ===
													team.id ? (
														<SidebarMenuBadge>
															<Check />
														</SidebarMenuBadge>
													) : null}
												</SidebarMenuButton>
											</SidebarMenuItem>
										</ContextMenuTrigger>
										<ContextMenuContent>
											<ContextMenuItem asChild>
												<Link
													href={`/settings/teams/${team.id}`}
												>
													<Settings />
													Settings
												</Link>
											</ContextMenuItem>
											<ContextMenuSeparator />
											<ContextMenuItem
												variant="destructive"
												onClick={() => {
													dialog.add({
														title: "Êtes-vous sûr ?",
														description:
															"Cette action est irréversible. L'équipe sera supprimée définitivement.",
														action: {
															label: "Supprimer",
															variant:
																"destructive",
															onClick:
																async () => {
																	await deleteTeam(
																		{
																			teamId: team.id,
																			organizationId:
																				team.organizationId,
																		}
																	);
																},
														},
														loading:
															deleteTeamPending,
													});
												}}
											>
												<Trash />
												Supprimer
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				) : null}
			</SidebarContent>
		</SidebarComp>
	);
}
