"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { UpdateOrgMemberSchema } from "./schema";

export const updateOrgMemberAction = orgAction
	.metadata({ permissions: { member: ["update"] } })
	.inputSchema(UpdateOrgMemberSchema)
	.action(async ({ parsedInput: { memberId, role }, ctx }) => {
		await prisma.member.update({
			where: {
				id: memberId,
			},
			data: {
				role,
			},
		});

		revalidatePath("/settings/members");
	});
