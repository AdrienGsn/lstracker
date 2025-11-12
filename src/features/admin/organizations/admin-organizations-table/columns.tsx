"use client";

import { Organization } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis, Eye, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteOrganizationAction } from "@/actions/admin/organization/delete";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { dialog } from "@/providers/dialog-provider";

export const adminOrganizationsTable: ColumnDef<Organization>[] = [
	{
		accessorKey: "name",
		header: "Organization",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					<Avatar className="size-10">
						{row.original.logo ? (
							<AvatarImage src={row.original.logo} />
						) : (
							<AvatarFallback>
								{row.original.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						)}
					</Avatar>
					<Typography className="font-bold">
						{row.original.name}
					</Typography>
				</div>
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

			const { executeAsync, isPending } = useAction(
				deleteOrganizationAction,
				{
					onSuccess: ({ data }) => {
						router.refresh();

						toast.success(
							`L’organisation "${data?.name}" a bien été supprimée !`
						);
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
							<Link
								href={`/admin/organizations/${row.original.id}`}
							>
								<Eye className="size-5" />
								Voir
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								dialog.add({
									title: "Confirmer la suppression",
									description:
										"Êtes-vous sûr de vouloir supprimer cette organisation ? Cette action est irréversible et toutes les données associées seront définitivement supprimées.",
									action: {
										label: "Oui, supprimer",
										variant: "destructive",
										onClick: () => {
											executeAsync({
												orgId: row.original.id,
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
