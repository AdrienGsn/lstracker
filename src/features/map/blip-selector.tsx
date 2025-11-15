"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { FieldValues } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormProps,
} from "@/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { blipsConfig } from "@/config/blips";
import { useEffect, useState } from "react";

export type BlipSelectorProps<T extends FieldValues> = {
	form: FormProps<T>["form"];
	fieldName: string;
};

export const BlipSelector = <T extends FieldValues>(
	props: BlipSelectorProps<T>
) => {
	const [searchValue, setSearchValue] = useState("");
	const [filteredBlips, setFilteredBlips] = useState<string[]>(blipsConfig);

	useEffect(() => {
		if (!searchValue) {
			setFilteredBlips(blipsConfig);
		} else {
			const lower = searchValue.toLowerCase();

			setFilteredBlips(
				blipsConfig.filter((blip) => blip.toLowerCase().includes(lower))
			);
		}
	}, [searchValue]);

	return (
		<FormField
			control={props.form.control}
			name={props.fieldName as any}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Icone</FormLabel>
					<FormControl>
						<Select
							value={field.value}
							onValueChange={field.onChange}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Sélectionnez une equipe" />
							</SelectTrigger>
							<SelectContent>
								<div className="size-full grid grid-cols-4 gap-2">
									<InputGroup className="col-span-4">
										<InputGroupAddon>
											<Search />
										</InputGroupAddon>
										<InputGroupInput
											placeholder="Rechercher..."
											onChange={(event) => {
												setSearchValue(
													event.target.value
												);
											}}
										/>
										{searchValue ? (
											<InputGroupAddon align="inline-end">
												{filteredBlips.length} Resultats
											</InputGroupAddon>
										) : null}
									</InputGroup>
									<SelectSeparator className="col-span-4" />
									{filteredBlips.map((blip) => (
										<SelectItem
											key={blip}
											value={blip}
											className="flex items-center justify-center"
										>
											<Image
												src={`/images/blips/${blip}`}
												alt={blip}
												height={20}
												width={20}
												loading="lazy"
											/>
										</SelectItem>
									))}
								</div>
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
