"use server";

import { auth } from "@/lib/auth";
import { adminAction } from "@/lib/safe-action";
import { headers } from "next/headers";
import { UnbanUserSchema } from "./schema";

export const unbanUserAction = adminAction
	.inputSchema(UnbanUserSchema)
	.action(async ({ parsedInput: { userId }, ctx }) => {
		await auth.api.unbanUser({
			body: {
				userId,
			},

			headers: await headers(),
		});
	});
