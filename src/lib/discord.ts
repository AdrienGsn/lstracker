import { Client, GatewayIntentBits } from "discord.js";

import { getServerUrl } from "./get-server-url";

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
						name: getServerUrl(),
						type: 3, // Listening
						url: getServerUrl(),
					},
				],
				status: "online",
			});
		}
	}

	return client;
}
