"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { adminAction } from "@/lib/safe-action";
import { BanUserSchema } from "./schema";

export const banUserAction = adminAction
	.inputSchema(BanUserSchema)
	.action(async ({ parsedInput: { userId, reason, expires }, ctx }) => {
		await auth.api.banUser({
			body: {
				userId,
				banReason: reason,
				banExpiresIn: expires, //60 * 60 * 24 * 7,
			},

			headers: await headers(),
		});
	});
