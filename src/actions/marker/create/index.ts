"use server";

import { revalidatePath } from "next/cache";

import { sendToDiscordChannelAction } from "@/actions/discord/channel";
import { siteConfig } from "@/config/site";
import { getServerUrl } from "@/lib/get-server-url";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { parseMetadata } from "@/utils/metadata";
import { CreateMarkerSchema } from "./schema";

export const createMarkerAction = orgAction
	.metadata({ permissions: { marker: ["create"] } })
	.inputSchema(CreateMarkerSchema)
	.action(async ({ parsedInput: { label, lat, lng, icon, teamId }, ctx }) => {
		await prisma.marker.create({
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
									name: "Nom",
									value: label,
									inline: true,
								},
								{
									name: "Latitude",
									value: Number(lat).toFixed(2),
									inline: true,
								},
								{
									name: "Longitude",
									value: Number(lng).toFixed(2),
									inline: true,
								},
							],
							footer: {
								text: siteConfig.title,
								icon_url: `${getServerUrl()}/images/logo.svg`,
							},
							timestamp: new Date().toISOString(),
						},
					});
				} catch (err: any) {
					logger.error(err);
				}
			}
		}

		revalidatePath("/");
	});
