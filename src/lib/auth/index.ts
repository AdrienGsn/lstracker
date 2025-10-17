import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { siteConfig } from "@/config/site";
import { ENV } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	user: {
		additionalFields: {
			admin: {
				type: "boolean",
				required: true,
			},
			prime: {
				type: "number",
				defaultValue: 0,
			},
		},
	},
	socialProviders: {
		discord: {
			clientId: ENV.BETTER_AUTH_DISCORD_ID,
			clientSecret: ENV.BETTER_AUTH_DISCORD_SECRET,
		},
	},
	appName: siteConfig.title,
	plugins: [nextCookies()],
	telemetry: { enabled: false },
});
