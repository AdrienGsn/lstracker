"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis, Eye, Shield, Trash } from "lucide-react";

import { banUserAction } from "@/actions/admin/user/ban";
import { deleteUserAction } from "@/actions/admin/user/delete";
import { unbanUserAction } from "@/actions/admin/user/unban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { dialog } from "@/providers/dialog-provider";
import { User } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const usersTable: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: "User",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-10">
						{row.original.image ? (
							<AvatarImage src={row.original.image} />
						) : (
							<AvatarFallback>
								{row.original.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="flex flex-col items-start">
						<Typography className="font-bold">
							{row.original.name}
						</Typography>
						<Typography variant="muted">
							{row.original.email}
						</Typography>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			return (
				<Badge
					variant={
						row.original.role === "admin" ? "default" : "secondary"
					}
				>
					{row.original.role === "admin" ? "admin" : "user"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "banned",
		header: "Bannis",
		cell: ({ row }) => {
			return (
				<Badge
					variant={row.original.banned ? "destructive" : "secondary"}
				>
					{row.original.banned ? "oui" : "non"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col">
					<Typography>
						{dayjs(row.original.createdAt).format("DD/MM/YYYY")}
					</Typography>
					<Typography variant="muted">
						{dayjs(row.original.createdAt).format("HH:mm:ss")}
					</Typography>
				</div>
			);
		},
	},
	{
		header: "Actions",
		cell: ({ row }) => {
			const router = useRouter();

			const { executeAsync: deleteUser, isPending: deleteUserPending } =
				useAction(deleteUserAction, {
					onSuccess: () => {
						router.refresh();

						toast.success("User has been deleted !");
					},
					onError: ({ error }) => {
						toast.error(error.serverError);
					},
				});

			const { executeAsync: banUser, isPending: banUserPending } =
				useAction(banUserAction, {
					onSuccess: () => {
						router.refresh;

						toast.success("L'utilisateur a bien été banni !");
					},
					onError: ({ error }) => {
						toast.error(error.serverError);
					},
				});

			const { executeAsync: unbanUser, isPending: unbanUserPending } =
				useAction(unbanUserAction, {
					onSuccess: () => {
						router.replace("/admin/users");

						toast.success("L'utilisateur a bien été débanni !");
					},
					onError: ({ error }) => {
						toast.error(error.serverError);
					},
				});

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Ellipsis className="size-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<Link href={`/admin/users/${row.original.id}`}>
								<Eye className="size-5" />
								Voir
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{row.original.banned ? (
							<DropdownMenuItem
								className="cursor-pointer"
								variant="destructive"
								onClick={() => {
									dialog.add({
										title: "Êtes-vous sûr ?",
										description:
											"Cette action retirera le bannissement de cet utilisateur. Êtes-vous sûr de vouloir continuer ?",
										action: {
											label: "Débannir",
											variant: "destructive",
											onClick: async () => {
												await unbanUser({
													userId: row.original.id,
												});
											},
										},
										loading: unbanUserPending,
									});
								}}
							>
								<Shield className="size-5" />
								Débannir
							</DropdownMenuItem>
						) : (
							<DropdownMenuItem
								className="cursor-pointer"
								variant="destructive"
								onClick={() => {}}
							>
								<Shield className="size-5" />
								Bannir
							</DropdownMenuItem>
						)}
						<DropdownMenuItem
							className="cursor-pointer"
							variant="destructive"
							onClick={() => {
								dialog.add({
									title: "Êtes vous sur ?",
									description:
										"Cette action est irréversible. L'utilisateur sera supprimé définitivement.",
									action: {
										label: "Supprimer",
										variant: "destructive",
										onClick: () => {
											deleteUser({
												userId: row.original.id,
											});
										},
									},
									loading: deleteUserPending,
								});
							}}
						>
							<Trash className="size-5" />
							Supprimer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
