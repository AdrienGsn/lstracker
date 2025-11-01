import { z } from "zod";

export const UpdateOrganizationSchema = z.object({
	orgId: z.string(),
	name: z.string(),
	slug: z.string(),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateOrganizationSchema>;
