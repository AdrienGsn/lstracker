import { createAccessControl, Statements } from "better-auth/plugins/access";
import {
	adminAc,
	defaultStatements,
	memberAc,
	ownerAc,
} from "better-auth/plugins/organization/access";
import { z } from "zod";

const statement = {
	...defaultStatements,
	marker: ["create", "update", "delete"],
} as const satisfies Statements;

export const AuthPermissionSchema = z.object(
	Object.fromEntries(
		Object.entries(statement).map(([key, actions]) => [
			key,
			z
				.array(z.enum(actions as unknown as [string, ...string[]]))
				.optional(),
		])
	) as any
) as z.ZodType<{
	[K in keyof typeof statement]?: (typeof statement)[K][number][];
}>;

export type AuthPermission = z.infer<typeof AuthPermissionSchema>;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
	marker: ["create"],
	...memberAc.statements,
});

export const admin = ac.newRole({
	marker: ["create", "update"],
	...adminAc.statements,
});

export const owner = ac.newRole({
	...(statement as Statements),
	...ownerAc.statements,
});

export const roles = { member, admin, owner } as const;

export const RolesKeys = ["member", "admin", "owner"] as const;

export type AuthRole = keyof typeof roles;
