import { createZodRoute, MiddlewareFunction } from "next-zod-route";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import z from "zod";
import { currentUser } from "./auth/helper";
import { roles } from "./auth/permissions";

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
	const { user } = await currentUser();

	if (!user) {
		throw new RouteError("You must be logged in !", 401);
	}

	return next({ ctx: { user } });
});

const rolesMetadataSchema = z.object({
	roles: z.array(z.nativeEnum(roles)),
});

const orgMiddleware: MiddlewareFunction = async ({ next, metadata }) => {
	const org = await requiredCurrentOrg();

	if (!org) {
		return new RouteError("You must be part of an organization", 403);
	}

	if (metadata?.roles && metadata.roles.length > 0) {
		const userHasRole = metadata.roles.some(
			(role) => org.userRole === role // Adapter selon ta structure
		);

		if (!userHasRole) {
			return new RouteError("You do not have the required role", 403);
		}
	}

	return next({ context: { org } });
};

export const orgRoute = createZodRoute({
	handleServerError,
})
	.defineMetadata(rolesMetadataSchema)
	.use(orgMiddleware);
