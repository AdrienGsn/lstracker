"use client";

import { User } from "@prisma/client";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TableFilter } from "@/features/data-table/table-filter";
import { TablePagination } from "@/features/data-table/table-pagination";

interface DataTableProps<TData extends User, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function UsersTable<TData extends User, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const router = useRouter();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="flex flex-col gap-4">
			<TableFilter
				table={table}
				searchableColumnIds={["name"]}
				placeholder="Rechercher..."
			/>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext()
											  )}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								<Empty>
									<EmptyHeader>
										<EmptyMedia variant="icon">
											<UserIcon />
										</EmptyMedia>
										<EmptyTitle>
											Aucun Utilisateur
										</EmptyTitle>
										<EmptyDescription>
											Vous n'avez aucun utilisateur pour
											le moment.
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<TablePagination table={table} />
		</div>
	);
}
