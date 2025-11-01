import { betterAuth, logger } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, organization } from "better-auth/plugins";

import { siteConfig } from "@/config/site";
import { getServerUrl } from "@/lib/get-server-url";
import { prisma } from "@/lib/prisma";
import { getActiveOrganization } from "./org";
import { ac, admin as adminAC, member, owner } from "./permissions";

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await prisma.organization.create({
						data: {
							name: `${user.name}'s organization`,
							members: {
								create: {
									userId: user.id,
									role: "owner",
								},
							},
						},
					});
				},
			},
		},
		session: {
			create: {
				before: async (session) => {
					const organization = await getActiveOrganization(
						session.userId
					);

					return {
						data: {
							...session,
							activeOrganizationId: organization.id,
						},
					};
				},
			},
		},
	},
	socialProviders: {
		discord: {
			clientId: process.env.BETTER_AUTH_DISCORD_ID as string,
			clientSecret: process.env.BETTER_AUTH_DISCORD_SECRET as string,
		},
	},
	appName: siteConfig.title,
	plugins: [
		organization({
			ac,
			roles: {
				owner,
				adminAC,
				member,
			},
			teams: { enabled: true },
			sendInvitationEmail: async (
				{ id, email, inviter, organization },
				request
			) => {
				const inviteLink = `${getServerUrl()}/join/${id}`;

				const message = `You've been invited to join "${organization.name}" on ${siteConfig.title} by ${inviter.user.name} (${inviter.user.email}).\nAccept your invitation: ${inviteLink}`;

				const account = await prisma.account.findFirst({
					where: {
						userId: inviter.user.id,
						providerId: "discord",
					},
				});

				if (account?.accountId && process.env.DISCORD_BOT_TOKEN) {
					try {
						const openDMResponse = await fetch(
							`https://discord.com/api/v10/users/@me/channels`,
							{
								method: "POST",
								headers: {
									Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									recipient_id: account?.accountId,
								}),
							}
						);

						if (openDMResponse.ok) {
							const dmChannel = await openDMResponse.json();

							await import("../discord").then(
								async ({ sendDiscordMessage }) => {
									await sendDiscordMessage({
										guildId: "", // Empty, since DMs have no guild
										channelId: dmChannel.id,
										message,
									});
								}
							);
						}
					} catch (err: any) {
						logger.error(err);
					}
				}
			},
		}),
		admin(),
		nextCookies(),
	],
});
