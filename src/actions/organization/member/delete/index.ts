"use server";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { DeleteOrgMemberSchema } from "./schema";

export const deleteOrgMemberAction = orgAction
	.metadata({ permissions: { member: ["delete"] } })
	.inputSchema(DeleteOrgMemberSchema)
	.action(async ({ parsedInput: { memberId }, ctx }) => {
		await prisma.member.delete({
			where: {
				id: memberId,
				organizationId: ctx.session.activeOrganizationId!,
			},
		});

		revalidatePath("/settings/members");
	});
