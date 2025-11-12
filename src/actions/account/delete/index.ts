"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/safe-action";

export const deleteAccountAction = authAction.action(async ({ ctx }) => {
	await prisma.user.delete({
		where: {
			id: ctx.user.id,
		},
	});
});
