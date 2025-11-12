"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarIcon, Ellipsis, Eye, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { toast } from "sonner";

import { deleteOrgMemberAction } from "@/actions/organization/member/delete";
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
import { useCurrentUser } from "@/hooks/use-current-user";
import { dialog } from "@/providers/dialog-provider";
import { MemberWithUser } from "@/types/organization";

export const membersTable: ColumnDef<MemberWithUser>[] = [
	{
		accessorKey: "user",
		header: "User",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-10">
						{row.original.user.image ? (
							<AvatarImage src={row.original.user.image} />
						) : (
							<AvatarFallback>
								{row.original.user.name
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="flex flex-col items-start">
						<Typography className="font-bold">
							{row.original.user.name}
						</Typography>
						<Typography variant="muted">
							{row.original.user.email}
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
			return <Badge variant="secondary">{row.original.role}</Badge>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Joined",
		cell: ({ row }) => {
			const joinedDate = dayjs(row.original.createdAt);
			const now = dayjs();
			const diffDays = now.diff(joinedDate, "days");
			const diffMonths = now.diff(joinedDate, "months");
			const diffYears = now.diff(joinedDate, "years");

			return (
				<div className="inline-flex items-center gap-2">
					<CalendarIcon className="size-4" />
					<span>
						{diffDays < 30
							? `${diffDays} days ago${diffDays > 1 ? "s" : ""}`
							: diffMonths < 12
							? `${diffMonths} month ago`
							: `${diffYears} year ago${
									diffYears > 1 ? "s" : ""
							  }`}
					</span>
				</div>
			);
		},
	},
	{
		header: "Actions",
		cell: ({ row }) => {
			const { user } = useCurrentUser();

			const { executeAsync, isPending } = useAction(
				deleteOrgMemberAction,
				{
					onSuccess: () => {
						toast.success("Le membre a bien été supprimé.");
					},
					onError: ({ error }) => {
						toast.error(error.serverError);
					},
				}
			);

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<Ellipsis className="size-5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem asChild>
							<Link href={`/settings/members/${row.original.id}`}>
								<Eye className="size-5" />
								Voir
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							variant="destructive"
							disabled={row.original.user.id === user?.id}
							onClick={() => {
								dialog.add({
									title: "Êtes vous sur ?",
									description:
										"Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce membre de l'organisation ?",
									action: {
										label: "Supprimer",
										variant: "destructive",
										onClick: async () => {
											await executeAsync({
												memberId: row.original.id,
											});
										},
									},
									loading: isPending,
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
