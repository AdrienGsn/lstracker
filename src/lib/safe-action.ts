import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import z from "zod";

import { currentUser } from "@/lib/auth/helper";
import { logger } from "@/lib/logger";
import { auth } from "./auth";
import { AuthPermissionSchema, RolesKeys } from "./auth/permissions";

export class ActionError extends Error {
	constructor(message: string) {
		super(message);

		this.name = "ActionError";
	}
}

const handleServerError = async (error: Error) => {
	if (error instanceof ActionError) {
		return error.message;
	}

	logger.error("Action error:", error.message);

	return "Quelque chose s'est mal passé!";
};

export const action = createSafeActionClient({
	handleServerError,
});

export const authAction = action.use(async ({ next }) => {
	const { user, session } = await currentUser();

	if (!user) {
		throw new ActionError("You must be logged in !");
	}

	return next({ ctx: { user, session } });
});

export const adminAction = authAction.use(async ({ next, ctx }) => {
	if (ctx.user.role !== "admin") {
		throw new ActionError("You are not authorized!");
	}

	return next({ ctx });
});

export const orgAction = createSafeActionClient({
	handleServerError,
	defineMetadataSchema: () => {
		return z
			.object({
				role: z.enum(RolesKeys).optional(),
				permissions: AuthPermissionSchema.optional(),
			})
			.optional();
	},
}).use(async ({ next, metadata = { role: "member" } }) => {
	try {
		const session = await auth.api.getSession({
			headers: await headers(),
		});

		if (!session?.user) {
			throw new ActionError("You must be logged in!");
		}

		if (metadata.permissions) {
			const hasAccess = await auth.api.hasPermission({
				headers: await headers(),
				body: {
					permission: metadata.permissions,
				},
			});

			if (!hasAccess.success) {
				throw new ActionError(
					"You don't have the required permissions."
				);
			}
		}

		return next({
			ctx: {
				user: session.user,
				session: session.session,
				role: metadata.role,
			},
		});
	} catch (error) {
		if (error instanceof ActionError) {
			throw error;
		}

		throw new ActionError(
			"You need to be part of an organization to access this resource."
		);
	}
});
