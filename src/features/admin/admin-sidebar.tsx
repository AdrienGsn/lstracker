"use client";

import {
	Building2,
	ChevronRight,
	LayoutGrid,
	MessageSquare,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { NavigationGroup } from "@/types/navigation";
import { AdminDropdown } from "./admin-dropdown";

const NAVIGATION: NavigationGroup[] = [
	{
		links: [
			{
				type: "LINK",
				icon: LayoutGrid,
				label: "Dashboard",
				href: "/admin",
			},
			{
				type: "LINK",
				icon: Users,
				label: "Users",
				href: "/admin/users",
			},
			{
				type: "LINK",
				icon: Building2,
				label: "Organizations",
				href: "/admin/organizations",
			},
			{
				type: "LINK",
				icon: MessageSquare,
				label: "Feedback",
				href: "/admin/feedback",
			},
			// {
			// 	type: "COLLAPSIBLE",
			// 	icon: Settings,
			// 	label: "links.settings.index",
			// 	href: "/settings",
			// 	subLinks: [
			// 		{
			// 			label: "links.settings.general",
			// 			href: "",
			// 		},
			// 		{
			// 			label: "links.settings.members",
			// 			href: "",
			// 		},
			// 		{
			// 			label: "links.settings.billing",
			// 			href: "",
			// 		},
			// 	],
			// },
		],
	},
];

export const AdminSidebar = () => {
	const { state } = useSidebar();
	const pathname = usePathname();

	return (
		<Sidebar variant="inset" collapsible="icon">
			<SidebarHeader>
				<AdminDropdown />
			</SidebarHeader>
			<SidebarContent>
				{NAVIGATION.map((menu, index) => (
					<SidebarGroup key={index}>
						{menu.label ? (
							<SidebarGroupLabel>{menu.label}</SidebarGroupLabel>
						) : null}
						<SidebarGroupContent>
							<SidebarMenu>
								{menu.links.map((link, index) => {
									if (link.type === "LINK") {
										return (
											<SidebarMenuItem key={index}>
												<SidebarMenuButton
													isActive={
														link.href === "/admin"
															? pathname ===
															  link.href
															: pathname ===
																	link.href ||
															  pathname.startsWith(
																	link.href +
																		"/"
															  )
													}
													tooltip={link.label}
													asChild
												>
													<Link href={link.href}>
														{link.icon ? (
															<link.icon />
														) : null}
														{link.label}
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									} else if (link.type === "COLLAPSIBLE") {
										return (
											<Collapsible
												key={index}
												asChild
												defaultOpen={link.isActive}
												className="group/collapsible"
											>
												<SidebarMenuItem>
													<CollapsibleTrigger asChild>
														<SidebarMenuButton
															tooltip={link.label}
															isActive={pathname.startsWith(
																link.href
															)}
															asChild={
																link.isLink
															}
														>
															{link.isLink ? (
																<Link
																	href={
																		link.href
																	}
																>
																	{link.icon && (
																		<link.icon />
																	)}
																	{link.label}
																	<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
																</Link>
															) : (
																<>
																	{link.icon && (
																		<link.icon />
																	)}
																	{link.label}
																	<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
																</>
															)}
														</SidebarMenuButton>
													</CollapsibleTrigger>
													<CollapsibleContent>
														<SidebarMenuSub>
															{link.subLinks?.map(
																(
																	subLink,
																	index
																) => (
																	<SidebarMenuSubItem
																		key={
																			index
																		}
																	>
																		<SidebarMenuSubButton
																			isActive={
																				subLink.href ===
																				pathname
																			}
																			asChild
																		>
																			<Link
																				href={
																					subLink.href
																				}
																			>
																				{subLink.icon && (
																					<subLink.icon />
																				)}
																				{
																					subLink.label
																				}
																			</Link>
																		</SidebarMenuSubButton>
																	</SidebarMenuSubItem>
																)
															)}
														</SidebarMenuSub>
													</CollapsibleContent>
												</SidebarMenuItem>
											</Collapsible>
										);
									}
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
};
