"use server";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { TransfertOrgSchema } from "./schema";

export const transfertOrgAction = orgAction
	.metadata({ permissions: { organization: ["delete"] } })
	.inputSchema(TransfertOrgSchema)
	.action(async ({ parsedInput: { memberId }, ctx }) => {
		await prisma.member.updateMany({
			where: {
				organizationId: ctx.session.activeOrganizationId!,
				userId: ctx.user.id,
			},
			data: {
				role: "member",
			},
		});

		await prisma.member.updateMany({
			where: {
				id: memberId,
				organizationId: ctx.session.activeOrganizationId!,
			},
			data: {
				role: "owner",
			},
		});
	});
