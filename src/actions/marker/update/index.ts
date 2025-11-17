"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { orgAction } from "@/lib/safe-action";
import { UpdateMarkerSchema } from "./schema";

export const updateMarkerAction = orgAction
	.metadata({ permissions: { marker: ["update"] } })
	.inputSchema(UpdateMarkerSchema)
	.action(
		async ({ parsedInput: { markerId, label, lat, lng, icon }, ctx }) => {
			await prisma.marker.update({
				where: { id: markerId },
				data: {
					label,
					lat: Number(lat),
					lng: Number(lng),
					icon,
				},
			});

			revalidatePath("/");
		}
	);
