import { ENV } from "@/lib/env";
import { orgRoute } from "@/lib/safe-route";
import { parseMetadata } from "@/utils/metadata";
import { NextResponse } from "next/server";

export const GET = orgRoute
	.metadata({ permissions: { team: ["update"] } })
	.handler(async (_req, { ctx }) => {
		try {
			const metadata = parseMetadata<{ guildId: string }>(
				ctx.organization.metadata
			);

			const response = await fetch(
				`https://discord.com/api/v10/guilds/${metadata?.guildId}/channels`,
				{
					headers: { Authorization: `Bot ${ENV.DISCORD_BOT_TOKEN}` },
				}
			);

			if (!response.ok) {
				if (response.status === 401) {
					return NextResponse.json(
						{
							error: "Token Discord invalide. Veuillez vous reconnecter.",
						},
						{ status: 401 }
					);
				}
				throw new Error(`Discord API error: ${response.status}`);
			}

			const channels = await response.json();

			const filtered = Array.isArray(channels)
				? channels
						.filter((ch: any) => ch.type !== 2)
						.map((ch: any) => ({
							id: ch.id,
							name: ch.name,
						}))
				: [];

			return NextResponse.json(filtered);
		} catch (error) {
			return NextResponse.json(
				{ error: "Erreur lors de la récupération des channels" },
				{ status: 500 }
			);
		}
	});
