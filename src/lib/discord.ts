import { Client, GatewayIntentBits } from "discord.js";

let client: Client | null = null;

export function getDiscordClient() {
	if (!client) {
		client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
			],
		});

		client.login(process.env.DISCORD_BOT_TOKEN);

		if (client.user) {
			client.user.setPresence({
				activities: [
					{
						name: "lstracker.vercel.app/",
						type: 3, // Listening
						url: "https://lstracker.vercel.app/",
					},
				],
				status: "online",
			});
		}
	}

	return client;
}
