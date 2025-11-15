"use client";

import {
	Check,
	ChevronsUpDown,
	Home,
	LogOut,
	Shield,
	User,
} from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { switchOrgAction } from "@/actions/organization/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { ThemeSelector } from "@/features/theme-selector";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth/client";
import { dialog } from "@/providers/dialog-provider";
import { CreateOrgBtn } from "./create-org-btn";

export const OrgDropdown = () => {
	const { state } = useSidebar();
	const { user } = useCurrentUser();
	const router = useRouter();

	const { data: activeOrg } = authClient.useActiveOrganization();
	const { data: orgs, isPending } = authClient.useListOrganizations();

	const { executeAsync: switchOrg, isPending: switchOrgPending } = useAction(
		switchOrgAction,
		{
			onSuccess: ({ data }) => {
				toast.success(`Basculement vers ${data?.name} réussi`);

				if (typeof window !== "undefined") {
					window.location.reload();
				}
			},
			onError: ({ error }) => {
				toast.error(error.serverError);
			},
		}
	);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="size-8">
								{activeOrg?.logo ? (
									<AvatarImage src={activeOrg.logo} />
								) : null}
								{!activeOrg?.logo ? (
									<AvatarFallback className="uppercase">
										{activeOrg?.name?.slice(0, 2)}
									</AvatarFallback>
								) : null}
							</Avatar>
							{state === "expanded" ? (
								<div className="grid flex-1 text-left leading-tight">
									<Typography
										variant="small"
										className="truncate"
									>
										{activeOrg?.name}
									</Typography>
								</div>
							) : null}
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="bottom"
						className="min-w-[250px]"
					>
						{orgs &&
							orgs.map((org) => (
								<DropdownMenuItem
									key={org.id}
									disabled={switchOrgPending}
									onClick={async () => {
										if (org.id !== activeOrg?.id) {
											await switchOrg({
												organizationId: org.id,
											});
										}
									}}
								>
									<Avatar className="size-6 text-xs">
										{org?.logo ? (
											<AvatarImage src={org.logo} />
										) : null}
										{!org?.logo ? (
											<AvatarFallback className="uppercase">
												{org?.name?.slice(0, 2)}
											</AvatarFallback>
										) : null}
									</Avatar>
									<Typography className="truncate">
										{org.name}
									</Typography>

									{activeOrg?.id === org.id ? (
										<DropdownMenuShortcut>
											<Check />
										</DropdownMenuShortcut>
									) : null}
								</DropdownMenuItem>
							))}
						<CreateOrgBtn />

						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/" className="cursor-pointer">
								<Home className="size-5" />
								Accueil
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/account" className="cursor-pointer">
								<User className="size-5" />
								Mon compte
							</Link>
						</DropdownMenuItem>
						{user?.role === "admin" ? (
							<DropdownMenuItem asChild>
								<Link href="/admin" className="cursor-pointer">
									<Shield className="size-5" />
									Administration
								</Link>
							</DropdownMenuItem>
						) : null}
						<DropdownMenuSeparator />
						<ThemeSelector />
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							onClick={() => {
								dialog.add({
									title: "Êtes-vous sûr de vouloir vous déconnecter ?",
									description:
										"Vous allez être déconnecté de votre compte et redirigé vers la page de connexion.",
									action: {
										label: "Déconnexion",
										variant: "destructive",
										onClick: async () => {
											await authClient.signOut({
												fetchOptions: {
													onSuccess: () => {
														router.push("/signin");
													},
												},
											});
										},
									},
								});
							}}
						>
							<LogOut className="size-5" />
							Déconnexion
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};
