"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { MarkerWithUser } from "@/types/marker";

export const teamMarkersTable: ColumnDef<MarkerWithUser>[] = [
	{
		accessorKey: "label",
		header: "Label",
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<Avatar className="size-5">
					<AvatarImage src={row.original.icon} />
				</Avatar>
				<Typography className="font-bold">
					{row.original.label}
				</Typography>
			</div>
		),
	},
	{
		accessorKey: "lat",
		header: "Latitude",
	},
	{
		accessorKey: "lng",
		header: "Longitude",
	},
	{
		accessorKey: "user",
		header: "Membre",
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
];
