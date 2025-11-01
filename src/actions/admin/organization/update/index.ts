"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { UpdateOrganizationSchema } from "./schema";

export const updateOrganizationAction = adminAction
	.inputSchema(UpdateOrganizationSchema)
	.action(async ({ parsedInput: { orgId, name, slug }, ctx }) => {
		await prisma.organization.update({
			where: { id: orgId },
			data: {
				name,
				slug,
			},
		});
	});
