"use client";

import { User } from "@/generated/prisma";
import { authClient } from "@/lib/auth/client";

export const useCurrentUser = () => {
	const session = authClient.useSession();

	return session.data?.user as User;
};
