"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { DeleteUserSchema } from "./schema";

export const deleteUserAction = adminAction
	.inputSchema(DeleteUserSchema)
	.action(async ({ parsedInput: { userId }, ctx }) => {
		await prisma.user.delete({ where: { id: userId } });
	});
