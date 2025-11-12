"use server";

import { EmbedBuilder, TextChannel } from "discord.js";

import { getDiscordClient } from "@/lib/discord";
import { logger } from "@/lib/logger";
import { ActionError, authAction } from "@/lib/safe-action";
import { SendToDiscordChannelSchema } from "./schema";

export const sendToDiscordChannelAction = authAction
	.inputSchema(SendToDiscordChannelSchema)
	.action(async ({ parsedInput: { channelId, message, embed }, ctx }) => {
		try {
			const client = getDiscordClient();

			if (!client.isReady()) {
				await new Promise((resolve) => client.once("ready", resolve));
			}

			const channel = await client.channels.fetch(channelId);

			if (!channel || !(channel instanceof TextChannel)) {
				return new ActionError("Canal non trouvé ou invalide");
			}

			const messageOptions: {
				content?: string;
				embeds?: EmbedBuilder[];
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

			await channel.send(messageOptions);
		} catch (error) {
			logger.error("Erreur Discord:", error);

			return new ActionError("Erreur lors de l'envoi du message");
		}
	});
