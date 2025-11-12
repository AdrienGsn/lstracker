import { z } from "zod";

export const InviteMemberSchema = z.object({
	teamId: z.string().optional().nullable(),
	discordId: z.string(),
	role: z.enum(["member", "admin"]).default("member"),
});

export type InviteMemberSchemaType = z.infer<typeof InviteMemberSchema>;
