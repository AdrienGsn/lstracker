import { ButtonStyle } from "discord.js";
import { z } from "zod";

const ButtonSchema = z.object({
	customId: z.string().min(1).max(100).optional(),
	label: z.string().min(1).max(80),
	style: z.nativeEnum(ButtonStyle).optional(),
	emoji: z.string().optional(),
	disabled: z.boolean().optional(),
	url: z.string().optional(),
});

const EmbedSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	color: z.number().int().min(0).max(0xffffff).optional(),
	url: z.string().url().optional(),
	timestamp: z.string().datetime().optional(),
	thumbnail: z
		.object({
			url: z.string().url(),
		})
		.optional(),
	image: z
		.object({
			url: z.string().url(),
		})
		.optional(),
	author: z
		.object({
			name: z.string(),
			url: z.string().url().optional(),
			icon_url: z.string().url().optional(),
		})
		.optional(),
	footer: z
		.object({
			text: z.string(),
			icon_url: z.string().url().optional(),
		})
		.optional(),
	fields: z
		.array(
			z.object({
				name: z.string(),
				value: z.string(),
				inline: z.boolean().optional(),
			})
		)
		.optional(),
});

export const SendToDiscordChannelSchema = z
	.object({
		channelId: z.string(),
		message: z.string().optional(),
		embed: EmbedSchema.optional(),
		buttons: z.array(ButtonSchema).max(25).optional(),
	})
	.refine(
		(data) => data.message || data.embed,
		"Le message ou l'embed doit être fourni"
	);

export type SendToDiscordChannelSchemaType = z.infer<
	typeof SendToDiscordChannelSchema
>;
