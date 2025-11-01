"use client";

import { authClient } from "@/lib/auth/client";

export const useCurrentUser = () => {
	const session = authClient.useSession();

	return {
		user: session.data?.user,
		session: session.data?.session,
	};
};
