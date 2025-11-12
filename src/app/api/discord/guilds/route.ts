import { prisma } from "@/lib/prisma";
import { authRoute } from "@/lib/safe-route";
import { NextResponse } from "next/server";

export const GET = authRoute.handler(async (_req, { ctx }) => {
	try {
		const discordAccount = await prisma.account.findFirst({
			where: { userId: ctx.user.id, providerId: "discord" },
		});

		if (!discordAccount) {
			return NextResponse.json(
				{ error: "Compte Discord non lié" },
				{ status: 400 }
			);
		}

		let accessToken = discordAccount.accessToken;

		const response = await fetch(
			"https://discord.com/api/v10/users/@me/guilds",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
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

		const guilds = await response.json();

		const formattedGuilds = guilds.map((guild: any) => ({
			id: guild.id,
			name: guild.name,
			icon: guild.icon,
			owner: guild.owner,
			permissions: guild.permissions,
		}));

		return NextResponse.json(formattedGuilds);
	} catch (error) {
		return NextResponse.json(
			{ error: "Erreur lors de la récupération des serveurs Discord" },
			{ status: 500 }
		);
	}
});
