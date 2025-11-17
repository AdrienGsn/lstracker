import { adminClient, organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getServerUrl } from "@/lib/get-server-url";
import { ac, admin, member, owner } from "./permissions";

export const authClient = createAuthClient({
	baseURL: getServerUrl(),
	plugins: [
		organizationClient({
			teams: { enabled: true },
			schema: {
				team: {
					additionalFields: {
						metadata: {
							type: "string",
							required: false,
						},
					},
				},
				invitation: {
					additionalFields: {
						teamId: {
							type: "string",
							required: false,
						},
					},
				},
			},
			ac,
			roles: {
				owner,
				admin,
				member,
			},
		}),
		adminClient(),
	],
});
