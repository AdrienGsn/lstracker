"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis, Eye, Trash } from "lucide-react";

import { deleteTeamAction } from "@/actions/organization/team/delete";
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
import { TeamWithMembersAndMarkers } from "@/types/organization";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { toast } from "sonner";

export const teamsTable: ColumnDef<TeamWithMembersAndMarkers>[] = [
	{
		accessorKey: "name",
		header: "Nom",
	},
	{
		accessorKey: "members",
		header: "Membre(s)",
		cell: ({ row }) => {
			return row.original.members.length;
		},
	},
	{
		accessorKey: "markers",
		header: "Marqueur(s)",
		cell: ({ row }) => {
			return row.original.markers.length;
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
			const { executeAsync, isPending } = useAction(deleteTeamAction, {
				onSuccess: () => {
					toast.success("L'equipe a bien été supprimé.");
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
							<Link href={`/settings/teams/${row.original.id}`}>
								<Eye className="size-5" />
								Voir
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer"
							variant="destructive"
							onClick={() => {
								dialog.add({
									title: "Êtes vous sur ?",
									description:
										"Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette equipe de l'organisation ?",
									action: {
										label: "Supprimer",
										variant: "destructive",
										onClick: async () => {
											await executeAsync({
												teamId: row.original.id,
												organizationId:
													row.original.organizationId,
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
