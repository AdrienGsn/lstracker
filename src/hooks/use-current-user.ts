"use client";

import { authClient } from "@/lib/auth/client";
import { User } from "@prisma/client";

export const useCurrentUser = () => {
	const session = authClient.useSession();

	return session.data?.user as User;
};
