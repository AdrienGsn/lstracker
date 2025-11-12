"use client";

import { useState } from "react";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}

	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}

	return !isNaN(date.getTime());
}

type DatePickerProps = {
	placeholder?: string;
} & React.ComponentProps<"input">;

export function DatePicker({
	value: controlledValue,
	onChange: controlledOnChange,
	placeholder = "January 01, 2025",
	className,
	...props
}: DatePickerProps) {
	const [open, setOpen] = useState(false);

	// Convertir la valeur string en Date pour le calendrier
	const getDateFromValue = (
		val: string | number | readonly string[] | undefined
	): Date | undefined => {
		if (typeof val === "string" && val) {
			const parsed = new Date(val);
			return isValidDate(parsed) ? parsed : undefined;
		}
		if (typeof val === "number") {
			const parsed = new Date(val);
			return isValidDate(parsed) ? parsed : undefined;
		}
		return undefined;
	};

	const controlledDate = getDateFromValue(controlledValue);
	const [internalDate, setInternalDate] = useState<Date | undefined>(
		controlledDate ?? new Date()
	);

	const date = controlledDate ?? internalDate;
	const displayValue =
		typeof controlledValue === "string"
			? controlledValue
			: typeof controlledValue === "number"
			? formatDate(new Date(controlledValue))
			: formatDate(internalDate);

	const [month, setMonth] = useState<Date | undefined>(date);

	const handleDateChange = (newDate: Date | undefined) => {
		if (controlledOnChange) {
			// Créer un event synthétique avec la valeur formatée
			const formattedValue = formatDate(newDate);
			const syntheticEvent = {
				target: { value: formattedValue },
				currentTarget: { value: formattedValue },
			} as React.ChangeEvent<HTMLInputElement>;
			controlledOnChange(syntheticEvent);
		} else {
			// Mode non-contrôlé
			setInternalDate(newDate);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const parsedDate = new Date(inputValue);

		if (controlledOnChange) {
			// Passer l'event directement à react-hook-form
			controlledOnChange(e);
			if (isValidDate(parsedDate)) {
				setMonth(parsedDate);
			}
		} else {
			// Mode non-contrôlé
			if (isValidDate(parsedDate)) {
				setInternalDate(parsedDate);
				setMonth(parsedDate);
			}
		}
	};

	return (
		<div className={cn("relative flex gap-2", className)}>
			<Input
				{...props}
				value={displayValue}
				placeholder={placeholder}
				className={cn("bg-background pr-10", className)}
				onChange={handleInputChange}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setOpen(true);
					}
					props.onKeyDown?.(e);
				}}
			/>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
					>
						<CalendarIcon className="size-3.5" />
						<span className="sr-only">Pick a date</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-auto overflow-hidden p-0"
					align="end"
					alignOffset={-8}
					sideOffset={10}
				>
					<Calendar
						mode="single"
						selected={date}
						month={month}
						onMonthChange={setMonth}
						onSelect={(selectedDate) => {
							handleDateChange(selectedDate);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
