import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, organization } from "better-auth/plugins";

import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";
import { getActiveOrganization } from "./org";
import { ac, admin, member, owner } from "./permissions";

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	databaseHooks: {
		session: {
			create: {
				before: async (session) => {
					const organization = await getActiveOrganization(
						session.userId
					);

					return {
						data: {
							...session,
							activeOrganizationId: organization?.id ?? undefined,
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
			permissions: 8, // 2048 | 16384, // Send Messages + Embed Links
			scope: ["identify", "guilds", "email", "guilds.members.read"],
		},
	},
	appName: siteConfig.title,
	plugins: [
		organization({
			schema: {
				team: {
					additionalFields: {
						metadata: {
							type: "string",
							required: false,
						},
					},
				},
				invitation: {
					additionalFields: {
						teamId: {
							type: "string",
							required: false,
						},
					},
				},
			},
			ac,
			roles: {
				owner,
				admin,
				member,
			},
			teams: { enabled: true },
		}),
		adminPlugin(),
		nextCookies(),
	],
});
