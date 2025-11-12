"use client";

import { Table } from "@tanstack/react-table";
import { CircleX, Search } from "lucide-react";
import { useRef } from "react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";

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
	);
}
