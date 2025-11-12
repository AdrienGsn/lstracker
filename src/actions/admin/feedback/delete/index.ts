"use server";

import { prisma } from "@/lib/prisma";
import { adminAction } from "@/lib/safe-action";
import { DeleteFeedbackSchema } from "./schema";

export const deleteFeedbackAction = adminAction
	.inputSchema(DeleteFeedbackSchema)
	.action(async ({ parsedInput: { feedbackId }, ctx }) => {
		await prisma.bugReport.delete({
			where: { id: feedbackId },
		});
	});
