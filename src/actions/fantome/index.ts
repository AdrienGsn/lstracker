"use server";

import { prisma } from "@/lib/prisma";
import { action } from "@/lib/safe-action";
import { FamtomeSchema } from "./schema";

export const fantomeAction = action
	.inputSchema(FamtomeSchema)
	.action(async ({ parsedInput: { lat, lng } }) => {
		await prisma.marker.create({
			data: {
				lat,
				lng,
				label: "Fantome",
			},
		});
	});
