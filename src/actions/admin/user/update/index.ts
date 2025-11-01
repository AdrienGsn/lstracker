"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { UpdateUserSchema } from "./schema";

export const updateUserAction = adminAction
	.inputSchema(UpdateUserSchema)
	.action(async ({ parsedInput: { userId, name, email, role }, ctx }) => {
		await prisma.user.update({
			where: { id: userId },
			data: {
				name,
				email,
				role,
			},
		});
	});
