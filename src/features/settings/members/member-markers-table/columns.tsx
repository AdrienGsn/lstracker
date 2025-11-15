"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { MarkerWithRelations } from "@/types/marker";

export const memberMarkersTable: ColumnDef<MarkerWithRelations>[] = [
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
		accessorKey: "team",
		header: "Equipe",
		cell: ({ row }) => {
			if (row.original.team) {
				return (
					<div className="flex items-center gap-2">
						<Avatar className="size-10">
							{/* {row.original.team.logo ? (
								<AvatarImage src={row.original.team.logo} />
							) : ( */}
							<AvatarFallback>
								{row.original.team.name
									.slice(0, 2)
									.toUpperCase()}
							</AvatarFallback>
							{/* )} */}
						</Avatar>
						<Typography className="font-bold">
							{row.original.team.name}
						</Typography>
					</div>
				);
			}

			return null;
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
