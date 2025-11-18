"use server";

import { revalidatePath } from "next/cache";

import { sendToDiscordChannelAction } from "@/actions/discord/channel";
import { siteConfig } from "@/config/site";
import { getServerUrl } from "@/lib/get-server-url";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { parseMetadata } from "@/utils/metadata";
import { ButtonStyle } from "discord.js";
import { CreateMarkerSchema } from "./schema";

export const createMarkerAction = orgAction
	.metadata({ permissions: { marker: ["create"] } })
	.inputSchema(CreateMarkerSchema)
	.action(async ({ parsedInput: { label, lat, lng, icon, teamId }, ctx }) => {
		const marker = await prisma.marker.create({
			data: {
				userId: ctx.user.id,
				organizationId: ctx.session.activeOrganizationId!,
				label,
				lat: Number(lat),
				lng: Number(lng),
				icon,
				teamId: teamId === "none" ? undefined : teamId,
			},
		});

		if (teamId) {
			const team = await prisma.team.findUnique({
				where: { id: teamId },
			});

			const metadata = parseMetadata<{ channelId: string }>(
				team?.metadata
			);

			if (metadata?.channelId) {
				try {
					await sendToDiscordChannelAction({
						channelId: metadata.channelId,
						embed: {
							title: `Nouveau marqueur ajouté : ${label}`,
							description: `Un nouveau marqueur a été ajouté sur la carte !`,
							thumbnail: {
								url: `${getServerUrl()}/images/logo.svg`,
							},
							color: 0x2ecc71,
							fields: [
								{
									name: "ID",
									value: marker.id,
									inline: false,
								},
								{
									name: "Nom",
									value: label,
									inline: false,
								},

								{
									name: "Latitude",
									value: Number(lat).toFixed(2),
									inline: false,
								},
								{
									name: "Longitude",
									value: Number(lng).toFixed(2),
									inline: false,
								},
							],
							footer: {
								text: siteConfig.title,
								icon_url: `${getServerUrl()}/images/apple-icon.png`,
							},
							timestamp: new Date().toISOString(),
						},
						buttons: [
							{
								customId: `copy-${Math.random()
									.toString(36)
									.substring(2, 10)}`,
								label: "Copier les coordonnées",
								style: ButtonStyle.Success,
								emoji: "📋",
							},
							{
								label: "Voir sur la carte",
								style: ButtonStyle.Link,
								url: `${getServerUrl()}?marker=${encodeURIComponent(
									marker.id
								)}`,
							},
						],
					});
				} catch (err: any) {
					logger.error(err);
				}
			}
		}

		revalidatePath("/");
	});
