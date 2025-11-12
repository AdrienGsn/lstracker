import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

interface DiscordGuild {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: string;
}

export interface DiscordServerSelectorProps<T extends FieldValues> {
	form: FormProps<T>["form"];
	fieldName: string;
}

export const DiscordServerSelector = <T extends FieldValues>(
	props: DiscordServerSelectorProps<T>
) => {
	const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

	const BOT_PERMISSIONS = "8";

	useEffect(() => {
		fetchUserGuilds();
	}, []);

	const fetchUserGuilds = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/discord/guilds");

			if (!response.ok) {
				throw new Error("Impossible de récupérer les serveurs");
			}

			const data = await response.json();

			const adminGuilds = data.filter((guild: DiscordGuild) => {
				const permissions = BigInt(guild.permissions);
				const hasAdmin = (permissions & BigInt(0x8)) === BigInt(0x8);

				return hasAdmin || guild.owner;
			});

			setGuilds(adminGuilds);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Une erreur est survenue"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleInviteBot = () => {
		const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${BOT_PERMISSIONS}&scope=bot%20applications.commands`;

		const popup = window.open(
			inviteUrl,
			"discord-bot-invite",
			"width=500,height=700"
		);

		const checkPopup = setInterval(() => {
			if (popup?.closed) {
				clearInterval(checkPopup);

				setTimeout(() => {
					fetchUserGuilds();
				}, 2000);
			}
		}, 1000);
	};

	return (
		<>
			<FormField
				control={props.form.control}
				name={props.fieldName as any}
				render={({ field }) => (
					<FormItem className="w-full">
						<FormLabel>Serveur Discord</FormLabel>
						<FormControl>
							<Select
								value={field.value}
								onValueChange={field.onChange}
								disabled={loading || guilds.length === 0}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Sélectionnez un serveur" />
								</SelectTrigger>
								<SelectContent>
									{guilds.map((guild) => (
										<SelectItem
											key={guild.id}
											value={guild.id}
										>
											<div className="flex items-center gap-2">
												{guild.icon ? (
													<img
														src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
														alt={guild.name}
														className="w-5 h-5 rounded-full"
													/>
												) : (
													<div className="w-5 h-5 rounded-full bg-gray-300" />
												)}
												<span>{guild.name}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Button
				type="button"
				variant="outline"
				onClick={handleInviteBot}
				disabled={loading}
				className="w-full"
			>
				{loading ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					"Inviter le bot"
				)}
			</Button>
		</>
	);
};
