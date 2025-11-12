import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { currentUser } from "./auth/helper";
import { hasPermission } from "./auth/org";
import { AuthPermissionSchema, RolesKeys } from "./auth/permissions";

export class RouteError extends Error {
	status?: number;

	constructor(message: string, status?: number) {
		super(message);

		this.status = status;
	}
}

const handleServerError = (error: Error) => {
	if (error instanceof RouteError) {
		return NextResponse.json(
			{ message: error.message, status: error.status },
			{
				status: error.status,
			}
		);
	}

	logger.error("Route error:", error.message);

	return NextResponse.json(
		{ message: "Internal server error" },
		{ status: 500 }
	);
};

export const route = createZodRoute({
	handleServerError,
});

export const authRoute = route.use(async ({ next }) => {
	const { user, session } = await currentUser();

	if (!user) {
		throw new RouteError("You must be logged in !", 401);
	}

	return next({ ctx: { user, session } });
});

const rolesMetadataSchema = z
	.object({
		role: z.enum(RolesKeys).optional(),
		permissions: AuthPermissionSchema.optional(),
	})
	.optional();

export const orgRoute = authRoute
	.defineMetadata(rolesMetadataSchema)
	.use(async ({ next, metadata, ctx, request }) => {
		const organization = await prisma.organization.findFirst({
			where: { id: ctx.session?.activeOrganizationId! },
		});

		if (!organization) {
			throw new RouteError("You must be part of an organization", 403);
		}

		const permissions = (metadata as { permissions?: unknown })
			?.permissions;

		if (permissions) {
			const hasAccess = await hasPermission(permissions);

			if (!hasAccess) {
				throw new RouteError(
					"You don't have the required permissions."
				);
			}
		}

		return next({ ctx: { organization } });
	});
