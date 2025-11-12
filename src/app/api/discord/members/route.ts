import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { ENV } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { orgRoute } from "@/lib/safe-route";
import { DiscordMember, FormattedDiscordMember } from "@/types/discord";
import { parseMetadata } from "@/utils/metadata";

async function getAllMembers(
	guildId: string,
	botToken: string,
	limit = 1000
): Promise<DiscordMember[]> {
	const members: DiscordMember[] = [];

	let after = "0";
	let hasMore = true;

	while (hasMore) {
		const response = await fetch(
			`https://discord.com/api/v10/guilds/${guildId}/members?limit=${limit}&after=${after}`,
			{
				headers: {
					Authorization: `Bot ${botToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`Discord API error: ${response.status}`);
		}

		const batch: DiscordMember[] = await response.json();

		if (batch.length === 0) {
			hasMore = false;
		} else {
			members.push(...batch);

			after = batch[batch.length - 1].user.id;

			if (batch.length < limit) {
				hasMore = false;
			}
		}
	}

	return members;
}

function formatMember(
	member: DiscordMember,
	guildId: string
): FormattedDiscordMember {
	const avatarUrl = member.user.avatar
		? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
		: `https://cdn.discordapp.com/embed/avatars/${
				parseInt(member.user.discriminator) % 5
		  }.png`;

	return {
		id: member.user.id,
		email: member.user.email,
		username: member.user.username,
		discriminator: member.user.discriminator,
		displayName: member.user.global_name || member.user.username,
		avatar: member.user.avatar,
		avatarUrl,
		isBot: member.user.bot || false,
		nickname: member.nick,
		roles: member.roles,
		joinedAt: member.joined_at,
		isPremium: member.premium_since !== null,
	};
}

export const GET = orgRoute
	.metadata({ permissions: { invitation: ["create"] } })
	.handler(async (request, { ctx }) => {
		try {
			const data = await auth.api.getSession({
				headers: await headers(),
			});

			const organization = await prisma.organization.findUnique({
				where: { id: data?.session.activeOrganizationId! },
			});

			const metadata = parseMetadata<{ guildId: string }>(
				organization?.metadata
			);

			const guildId = metadata?.guildId;

			if (!guildId) {
				return NextResponse.json(
					{
						error: "Aucun serveur Discord associé à cette organisation",
					},
					{ status: 400 }
				);
			}

			const members = await getAllMembers(guildId, ENV.DISCORD_BOT_TOKEN);

			let formattedMembers = members.map((member) =>
				formatMember(member, guildId)
			);

			formattedMembers = formattedMembers.filter(
				(member) => !member.isBot
			);

			return NextResponse.json({
				members: formattedMembers,
			});
		} catch (error) {
			return NextResponse.json(
				{
					error: "Erreur lors de la récupération des membres du serveur Discord",
				},
				{ status: 500 }
			);
		}
	});
