"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { DeleteOrganizationSchema } from "./schema";

export const deleteOrganizationAction = adminAction
	.inputSchema(DeleteOrganizationSchema)
	.action(async ({ parsedInput: { orgId }, ctx }) => {
		await prisma.organization.delete({
			where: { id: orgId },
		});
	});
