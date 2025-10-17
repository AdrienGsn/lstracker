import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { currentUser } from "./auth/helper";

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
