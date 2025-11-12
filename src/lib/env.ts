import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const ENV = createEnv({
	server: {
		NODE_ENV: z.enum(["development", "production", "test"]),
		DATABASE_URL: z.url(),
		DATABASE_URL_UNPOOLED: z.url(),
		BLOB_READ_WRITE_TOKEN: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(1),
		BETTER_AUTH_DISCORD_ID: z.string().min(1),
		BETTER_AUTH_DISCORD_SECRET: z.string().min(1),
		DISCORD_BOT_TOKEN: z.string().min(1),
	},
	experimental__runtimeEnv: {},
});
