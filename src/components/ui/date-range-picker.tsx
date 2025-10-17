"use client";

import {
	endOfMonth,
	endOfYear,
	format,
	startOfMonth,
	startOfYear,
	subDays,
	subMonths,
	subYears,
} from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DateRangePickerProps = {
	onValueChange: (date: DateRange) => void;
};

export default function DateRangePicker(props: DateRangePickerProps) {
	const today = new Date();

	const yesterday = {
		from: subDays(today, 1),
		to: subDays(today, 1),
	};

	const last7Days = {
		from: subDays(today, 6),
		to: today,
	};

	const last30Days = {
		from: subDays(today, 29),
		to: today,
	};

	const monthToDate = {
		from: startOfMonth(today),
		to: today,
	};

	const lastMonth = {
		from: startOfMonth(subMonths(today, 1)),
		to: endOfMonth(subMonths(today, 1)),
	};

	const yearToDate = {
		from: startOfYear(today),
		to: today,
	};

	const lastYear = {
		from: startOfYear(subYears(today, 1)),
		to: endOfYear(subYears(today, 1)),
	};

	const [month, setMonth] = useState(today);
	const [date, setDate] = useState<DateRange | undefined>(last7Days);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="group bg-background hover:bg-background border-input justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] w-[220px]"
				>
					<span
						className={cn(
							"truncate",
							!date && "text-muted-foreground"
						)}
					>
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "dd/MM/yyyy")} -{" "}
									{format(date.to, "dd/MM/yyyy")}
								</>
							) : (
								format(date.from, "dd/MM/yyyy")
							)
						) : (
							"Pick a date range"
						)}
					</span>
					<CalendarIcon
						size={16}
						className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
						aria-hidden="true"
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-2" align="start">
				<div className="flex max-sm:flex-col">
					<div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
						<div className="h-full sm:border-e">
							<div className="flex flex-col px-2">
								<DateRangeQuickButton
									label="Aujourd'hui"
									onClick={() => {
										setDate({
											from: today,
											to: today,
										});

										setMonth(today);

										props.onValueChange({
											from: today,
											to: today,
										});
									}}
								/>
								<DateRangeQuickButton
									label="Hier"
									onClick={() => {
										setDate(yesterday);

										setMonth(yesterday.to);

										props.onValueChange({
											from: yesterday.from,
											to: yesterday.to,
										});
									}}
								/>
								<DateRangeQuickButton
									label="7 derniers jours"
									onClick={() => {
										setDate(last7Days);

										setMonth(last7Days.to);

										props.onValueChange({
											from: last7Days.from,
											to: last7Days.to,
										});
									}}
								/>
								<DateRangeQuickButton
									label="30 derniers jours"
									onClick={() => {
										setDate(last30Days);

										setMonth(last30Days.to);

										props.onValueChange({
											from: last30Days.from,
											to: last30Days.to,
										});
									}}
								/>
								<DateRangeQuickButton
									label="Ce mois-ci"
									onClick={() => {
										setDate(monthToDate);

										setMonth(monthToDate.to);

										props.onValueChange({
											from: monthToDate.from,
											to: monthToDate.to,
										});
									}}
								/>
								<DateRangeQuickButton
									label="Mois dernier"
									onClick={() => {
										setDate(lastMonth);

										setMonth(lastMonth.to);

										props.onValueChange({
											from: lastMonth.from,
											to: lastMonth.to,
										});
									}}
								/>
								<DateRangeQuickButton
									label="Cette année"
									onClick={() => {
										setDate(yearToDate);

										setMonth(yearToDate.to);

										props.onValueChange({
											from: yearToDate.from,
											to: yearToDate.to,
										});
									}}
								/>
								<DateRangeQuickButton
									label="Année dernière"
									onClick={() => {
										setDate(lastYear);

										setMonth(lastYear.to);

										props.onValueChange({
											from: lastYear.from,
											to: lastYear.to,
										});
									}}
								/>
							</div>
						</div>
					</div>
					<Calendar
						mode="range"
						selected={date}
						onSelect={(newDate) => {
							if (newDate) {
								setDate(newDate);

								props.onValueChange(newDate);
							}
						}}
						month={month}
						onMonthChange={setMonth}
						className="p-2"
						disabled={[
							{ after: today }, // Dates before today
						]}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

const DateRangeQuickButton = ({
	label,
	onClick,
}: {
	label: string;
	onClick: () => void;
}) => {
	return (
		<Button
			variant="ghost"
			size="sm"
			className="w-full justify-start"
			onClick={onClick}
		>
			{label}
		</Button>
	);
};
