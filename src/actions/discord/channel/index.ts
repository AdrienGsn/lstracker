"use server";

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	DiscordAPIError,
	EmbedBuilder,
	TextChannel,
} from "discord.js";

import { getDiscordClient } from "@/lib/discord";
import { logger } from "@/lib/logger";
import { ActionError, authAction } from "@/lib/safe-action";
import { SendToDiscordChannelSchema } from "./schema";

export const sendToDiscordChannelAction = authAction
	.inputSchema(SendToDiscordChannelSchema)
	.action(
		async ({
			parsedInput: { channelId, message, embed, buttons },
			ctx,
		}) => {
			try {
				const client = getDiscordClient();

				if (!client.isReady()) {
					await new Promise((resolve) =>
						client.once("ready", resolve)
					);
				}

				let channel;
				try {
					channel = await client.channels.fetch(channelId);
				} catch (fetchError) {
					if (
						fetchError instanceof DiscordAPIError &&
						fetchError.code === 10003
					) {
						logger.error(
							`Canal Discord introuvable: ${channelId}`,
							fetchError
						);
						return new ActionError(
							"Le canal Discord n'existe pas ou n'est plus accessible. Veuillez vérifier la configuration de l'équipe."
						);
					}
					throw fetchError;
				}

				if (!channel || !(channel instanceof TextChannel)) {
					return new ActionError("Canal non trouvé ou invalide");
				}

				const messageOptions: {
					content?: string;
					embeds?: EmbedBuilder[];
					components?: ActionRowBuilder<ButtonBuilder>[];
				} = {};

				if (message) {
					messageOptions.content = message;
				}

				if (embed) {
					const embedBuilder = new EmbedBuilder();

					if (embed.title) embedBuilder.setTitle(embed.title);
					if (embed.description)
						embedBuilder.setDescription(embed.description);
					if (embed.color) embedBuilder.setColor(embed.color);
					if (embed.url) embedBuilder.setURL(embed.url);
					if (embed.timestamp)
						embedBuilder.setTimestamp(new Date(embed.timestamp));
					if (embed.thumbnail)
						embedBuilder.setThumbnail(embed.thumbnail.url);
					if (embed.image) embedBuilder.setImage(embed.image.url);
					if (embed.author) {
						embedBuilder.setAuthor({
							name: embed.author.name,
							url: embed.author.url,
							iconURL: embed.author.icon_url,
						});
					}
					if (embed.footer) {
						embedBuilder.setFooter({
							text: embed.footer.text,
							iconURL: embed.footer.icon_url,
						});
					}
					if (embed.fields) {
						embedBuilder.addFields(
							embed.fields.map((field) => ({
								name: field.name,
								value: field.value,
								inline: field.inline ?? false,
							}))
						);
					}

					messageOptions.embeds = [embedBuilder];
				}

				if (buttons && buttons.length > 0) {
					const rows: ActionRowBuilder<ButtonBuilder>[] = [];

					for (let i = 0; i < buttons.length; i += 5) {
						const row = new ActionRowBuilder<ButtonBuilder>();
						const rowButtons = buttons.slice(i, i + 5);

						rowButtons.forEach((btn) => {
							const button = new ButtonBuilder()
								.setLabel(btn.label)
								.setStyle(btn.style || ButtonStyle.Primary);

							if (btn.customId) button.setCustomId(btn.customId);
							if (btn.emoji) button.setEmoji(btn.emoji);
							if (btn.disabled) button.setDisabled(btn.disabled);
							if (btn.url) button.setURL(btn.url);

							row.addComponents(button);
						});

						rows.push(row);

						if (rows.length >= 5) break;
					}

					messageOptions.components = rows;
				}

				await channel.send(messageOptions);
			} catch (error) {
				if (error instanceof DiscordAPIError) {
					if (error.code === 10003) {
						logger.error(
							`Canal Discord introuvable lors de l'envoi: ${channelId}`,
							error
						);
						return new ActionError(
							"Le canal Discord n'existe pas ou n'est plus accessible. Veuillez vérifier la configuration de l'équipe."
						);
					}
					if (error.code === 50013) {
						logger.error(
							`Permissions insuffisantes pour le canal: ${channelId}`,
							error
						);
						return new ActionError(
							"Le bot Discord n'a pas les permissions nécessaires pour envoyer des messages dans ce canal."
						);
					}
					logger.error(
						`Erreur Discord API (code ${error.code}):`,
						error
					);
					return new ActionError(
						`Erreur Discord: ${error.message || "Erreur inconnue"}`
					);
				}

				logger.error("Erreur Discord:", error);

				return new ActionError("Erreur lors de l'envoi du message");
			}
		}
	);
