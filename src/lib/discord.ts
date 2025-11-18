import {
	Client,
	DiscordAPIError,
	GatewayIntentBits,
	Interaction,
} from "discord.js";

import { getServerUrl } from "./get-server-url";
import { logger } from "./logger";

let client: Client | null = null;
let buttonInteractionsSetup = false;
const processingInteractions = new Set<string>();

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

	if (!buttonInteractionsSetup) {
		setupButtonInteractions(client);
		buttonInteractionsSetup = true;
	}

	return client;
}

if (typeof process !== "undefined") {
	process.on("unhandledRejection", (reason: any) => {
		if (
			reason instanceof DiscordAPIError &&
			(reason.code === 40060 || reason.status === 503)
		) {
			return;
		}

		if (reason?.status === 503 || reason?.name === "HTTPError") {
			return;
		}

		logger.error("Promesse rejetée non gérée:", reason);
	});
}

export function setupButtonInteractions(client: Client) {
	if (client.listenerCount("interactionCreate") > 0) {
		return;
	}

	client.on("interactionCreate", async (interaction: Interaction) => {
		if (!interaction.isButton()) return;

		const interactionId = interaction.id;

		if (processingInteractions.has(interactionId)) {
			return;
		}

		processingInteractions.add(interactionId);

		const handleInteraction = async () => {
			try {
				const { customId, user } = interaction;

				switch (customId) {
					case undefined:
						break;

					default:
						if (
							customId &&
							typeof customId === "string" &&
							customId.startsWith("copy-")
						) {
							if (!interaction.isRepliable()) {
								return;
							}

							if (interaction.replied || interaction.deferred) {
								return;
							}

							const coordinates =
								interaction.message.embeds?.[0]?.fields
									?.filter((field) =>
										["Latitude", "Longitude"].includes(
											field.name
										)
									)
									.map((field) => `${field.value}`)
									.join(", ") || "Non disponible";

							try {
								await interaction.reply({
									content: `Coordonnées à copier : ${coordinates}`,
									ephemeral: true,
								});
							} catch (replyError: any) {
								if (
									replyError instanceof DiscordAPIError &&
									replyError.code === 40060
								) {
									return;
								}

								if (
									replyError?.status === 503 ||
									(replyError instanceof DiscordAPIError &&
										replyError.status === 503)
								) {
									return;
								}

								throw replyError;
							}
						}
						break;
				}
			} catch (error: any) {
				if (error instanceof DiscordAPIError && error.code === 40060) {
					return;
				}

				if (
					error?.status === 503 ||
					(error instanceof DiscordAPIError &&
						error.status === 503) ||
					error?.name === "HTTPError"
				) {
					return;
				}

				if (
					interaction.isRepliable() &&
					!interaction.replied &&
					!interaction.deferred
				) {
					try {
						await interaction.reply({
							content: "Une erreur s'est produite.",
							ephemeral: true,
						});
					} catch (replyError: any) {
						if (
							replyError instanceof DiscordAPIError &&
							(replyError.code === 40060 ||
								replyError.status === 503)
						) {
							return;
						}

						if (
							replyError?.name === "HTTPError" ||
							replyError?.status === 503
						) {
							return;
						}
					}
				}
			}
		};

		handleInteraction()
			.catch((error: any) => {
				if (error instanceof DiscordAPIError && error.code === 40060) {
					return;
				}

				if (
					error?.status === 503 ||
					(error instanceof DiscordAPIError &&
						error.status === 503) ||
					error?.name === "HTTPError"
				) {
					return;
				}

				logger.error("Erreur non gérée dans interactionCreate:", error);
			})
			.finally(() => {
				setTimeout(() => {
					processingInteractions.delete(interactionId);
				}, 5000);
			});
	});
}
