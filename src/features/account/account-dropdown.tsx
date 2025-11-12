"use client";

import { ChevronsUpDown, Home, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
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

export const AccountDropdown = () => {
	const { state } = useSidebar();
	const { user } = useCurrentUser();
	const router = useRouter();

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
								{user?.image ? (
									<AvatarImage src={user.image} />
								) : null}
								{!user?.image ? (
									<AvatarFallback className="uppercase">
										{user?.name?.slice(0, 2)}
									</AvatarFallback>
								) : null}
							</Avatar>
							{state === "expanded" ? (
								<div className="grid flex-1 text-left leading-tight">
									<Typography
										variant="small"
										className="truncate"
									>
										{user?.name}
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
						<div className="grid flex-1 text-left leading-tight px-2 py-1.5">
							<Typography variant="small" className="truncate">
								{user?.name}
							</Typography>
							<Typography
								variant="muted"
								className="truncate text-xs"
							>
								{user?.email}
							</Typography>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/" className="cursor-pointer">
								<Home className="size-5" />
								Accueil
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
