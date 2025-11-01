"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { DeleteAllUserSessionsSchema } from "./schema";

export const deleteAllUserSessionsAction = adminAction
	.inputSchema(DeleteAllUserSessionsSchema)
	.action(async ({ parsedInput: { userId }, ctx }) => {
		await prisma.session.deleteMany({ where: { userId } });
	});
