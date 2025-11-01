"use client";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Table } from "@tanstack/react-table";
import { CircleX, Search } from "lucide-react";
import { useRef } from "react";

type TableFilterProps<TData> = {
	table: Table<TData>;
	searchableColumnIds: string[];
	placeholder?: string;
};

export function TableFilter<TData>({
	table,
	searchableColumnIds,
	placeholder = "Filtre...",
}: TableFilterProps<TData>) {
	const inputRef = useRef<HTMLInputElement>(null);

	// Détermine la valeur courante commune aux colonnes
	const filterValue = (() => {
		for (const columnId of searchableColumnIds) {
			const val = table.getColumn(columnId)?.getFilterValue();
			if (typeof val === "string" && val.length > 0) {
				return val;
			}
		}
		return "";
	})();

	const hasFilter = filterValue.length > 0;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		for (const columnId of searchableColumnIds) {
			table.getColumn(columnId)?.setFilterValue(value);
		}
	};

	const handleClear = () => {
		for (const columnId of searchableColumnIds) {
			table.getColumn(columnId)?.setFilterValue("");
		}
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	return (
		<InputGroup>
			<InputGroupInput
				ref={inputRef}
				placeholder={placeholder}
				value={filterValue}
				onChange={handleInputChange}
			/>
			<InputGroupAddon>
				<Search />
			</InputGroupAddon>
			{hasFilter ? (
				<InputGroupAddon
					align="inline-end"
					className="cursor-pointer"
					onClick={handleClear}
				>
					<CircleX size={16} strokeWidth={2} aria-hidden="true" />
				</InputGroupAddon>
			) : null}
		</InputGroup>
		// <div className="relative">
		// 	<Input
		// 		ref={inputRef}
		// 		className={cn("peer min-w-60 ps-9", hasFilter && "pe-9")}
		// 		value={filterValue}
		// 		onChange={handleInputChange}
		// 		placeholder={placeholder}
		// 		type="text"
		// 	/>
		// 	<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
		// 		<Search className="size-4" strokeWidth={2} aria-hidden="true" />
		// 	</div>
		// 	{hasFilter && (
		// 		<button
		// 			className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
		// 			aria-label="Clear filter"
		// 			type="button"
		// 			onClick={handleClear}
		// 		>
		// 			<CircleX size={16} strokeWidth={2} aria-hidden="true" />
		// 		</button>
		// 	)}
		// </div>
	);
}
