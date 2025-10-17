"use server";

import { prisma } from "./prisma";

export const getAllMarker = async () => {
	return await prisma.marker.findMany();
};
