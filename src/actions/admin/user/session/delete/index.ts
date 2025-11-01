"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { DeleteUserSession } from "./schema";

export const deleteUserSessionAction = adminAction
	.inputSchema(DeleteUserSession)
	.action(async ({ parsedInput: { sessionId }, ctx }) => {
		await prisma.session.delete({
			where: {
				id: sessionId,
			},
		});
	});
