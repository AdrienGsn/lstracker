import { createSafeActionClient } from "next-safe-action";

import { currentUser } from "@/lib/auth/helper";
import { logger } from "@/lib/logger";

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
	const { user } = await currentUser();

	if (!user) {
		throw new ActionError("You must be logged in !");
	}

	return next({ ctx: { user } });
});
