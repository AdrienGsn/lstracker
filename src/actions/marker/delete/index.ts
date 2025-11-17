"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { DeleteMarkerSchema } from "./schema";

export const deleteMarkerAction = orgAction
	.metadata({ permissions: { marker: ["delete"] } })
	.inputSchema(DeleteMarkerSchema)
	.action(async ({ parsedInput: { markerId }, ctx }) => {
		await prisma.marker.delete({
			where: { id: markerId },
		});

		revalidatePath("/");
	});
