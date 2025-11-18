import {
	Client,
	DiscordAPIError,
	GatewayIntentBits,
	Interaction,
} from "discord.js";

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

	setupButtonInteractions(client);

	return client;
}

export function setupButtonInteractions(client: Client) {
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (!interaction.isButton()) return;

		try {
			const { customId, user } = interaction;

			switch (customId) {
				case "copy": {
					const coordinates =
						interaction.message.embeds?.[0]?.fields
							?.filter((field) =>
								["Latitude", "Longitude"].includes(field.name)
							)
							.map((field) => `${field.value}`)
							.join(", ") || "Non disponible";

					await interaction.reply({
						content: `Coordonnées à copier : ${coordinates}`,
						ephemeral: true,
					});

					break;
				}
				// case "view": {
				// 	const embed = interaction.message.embeds?.[0];

				// 	let markerId = embed?.fields?.find(
				// 		(f) => f.name === "ID"
				// 	)?.value;

				// 	const url = markerId
				// 		? `${getServerUrl()}?marker=${encodeURIComponent(
				// 				markerId
				// 		  )}`
				// 		: getServerUrl();

				// 	await interaction.reply({
				// 		content: `🔗 [Voir le marqueur](${url})`,
				// 		ephemeral: true,
				// 	});

				// 	break;
				// }
				default:
					break;
			}
		} catch (error) {
			// Ignorer les erreurs d'interaction déjà reconnue
			if (error instanceof DiscordAPIError && error.code === 40060) {
				return;
			}

			// Essayer de répondre à l'interaction si elle n'a pas encore été répondue
			try {
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({
						content: "Une erreur s'est produite.",
						ephemeral: true,
					});
				} else if (interaction.replied) {
					// Si l'interaction a déjà été répondue, utiliser followUp
					await interaction.followUp({
						content: "Une erreur s'est produite.",
						ephemeral: true,
					});
				}
			} catch (replyError) {
				// Ignorer les erreurs lors de la tentative de réponse
				// pour éviter les boucles d'erreur
				if (
					!(replyError instanceof DiscordAPIError) ||
					replyError.code !== 40060
				) {
					console.error(
						"Erreur lors de la gestion d'erreur:",
						replyError
					);
				}
			}
		}
	});
}
