"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TablePaginationProps<TData> {
	table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
	return (
		<div className="flex items-center gap-2 mx-auto">
			<Button
				variant="outline"
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span className="sr-only">Go to previous page</span>
				<ChevronLeft />
				Previous
			</Button>
			<Button
				variant="outline"
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span className="sr-only">Go to next page</span>
				Next
				<ChevronRight />
			</Button>
		</div>
	);
}
