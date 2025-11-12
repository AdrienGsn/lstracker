import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from ".";
import { AuthPermission } from "./permissions";

export const hasPermission = async (permission: AuthPermission) => {
	const result = await auth.api.hasPermission({
		headers: await headers(),
		body: {
			permission,
		},
	});

	return result.success;
};

export async function getActiveOrganization(userId: string) {
	const existingSession = await prisma.session.findFirst({
		where: {
			userId: userId,
			activeOrganizationId: { not: null },
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (existingSession?.activeOrganizationId) {
		const org = await prisma.organization.findUnique({
			where: { id: existingSession.activeOrganizationId },
		});

		if (org) return org;
	}

	const ownerMember = await prisma.member.findFirst({
		where: {
			userId: userId,
			role: "owner",
		},
		include: {
			organization: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	if (ownerMember) return ownerMember.organization;

	const anyMember = await prisma.member.findFirst({
		where: {
			userId: userId,
		},
		include: {
			organization: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	if (!anyMember) {
		return null;
	}

	return anyMember.organization;
}
