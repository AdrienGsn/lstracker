import { createAuthClient } from "better-auth/react";

import { getServerUrl } from "@/lib/get-server-url";

export const authClient = createAuthClient({
	baseURL: getServerUrl(),
	plugins: [],
});
