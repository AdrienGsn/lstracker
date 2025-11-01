"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis, Eye, Trash } from "lucide-react";

import { deleteUserAction } from "@/actions/admin/user/delete";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
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
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => {
			return dayjs(row.original.createdAt).format("DD/MM/YYYY");
		},
	},
	{
		header: "Actions",
		cell: ({ row }) => {
			const router = useRouter();

			const { executeAsync, isPending } = useAction(deleteUserAction, {
				onSuccess: () => {
					router.refresh();

					toast.success("User has been deleted !");
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
						<DropdownMenuItem
							onClick={() => {
								dialog.add({
									title: "Êtes vous sur ?",
									description:
										"Cette action est irréversible. L'utilisateur sera supprimé définitivement.",
									action: {
										label: "Supprimer",
										variant: "destructive",
										onClick: () => {
											executeAsync({
												userId: row.original.id,
											});
										},
									},
									loading: isPending,
								});
							}}
						>
							<Trash className="size-5 text-red-500" />
							Supprimer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
