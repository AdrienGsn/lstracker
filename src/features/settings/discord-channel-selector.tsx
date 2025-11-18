"use client";

import { useEffect, useState } from "react";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DiscordChannel {
	id: string;
	name: string;
}

export interface DiscordChannelSelectorProps<T extends FieldValues> {
	form: FormProps<T>["form"];
	fieldName: string;
}

export const DiscordChannelSelector = <T extends FieldValues>(
	props: DiscordChannelSelectorProps<T>
) => {
	const [channels, setChannels] = useState<DiscordChannel[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchChannels();
	}, []);

	const fetchChannels = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/discord/channels");

			if (!response.ok) {
				throw new Error("Impossible de récupérer les channels");
			}

			const data = await response.json();

			setChannels(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Une erreur est survenue"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<FormField
			control={props.form.control}
			name={props.fieldName as any}
			render={({ field }) => (
				<FormItem className="w-full">
					<FormLabel>Channel associé :</FormLabel>
					<FormControl className="w-full">
						<Select
							value={field.value}
							onValueChange={field.onChange}
							disabled={loading || channels.length === 0}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Sélectionnez un channel" />
							</SelectTrigger>
							<SelectContent side="bottom">
								{channels.map((channel) => (
									<SelectItem
										key={channel.id}
										value={channel.id}
									>
										<span>{channel.name}</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
