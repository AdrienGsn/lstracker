import { z } from "zod";

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

export const SendDiscordDMSchema = z
	.object({
		accountId: z.string(),
		message: z.string().optional(),
		embed: EmbedSchema.optional(),
	})
	.refine(
		(data) => data.message || data.embed,
		"Le message ou l'embed doit être fourni"
	);

export type SendDiscordDMSchemaType = z.infer<typeof SendDiscordDMSchema>;
