import { z } from "zod";

export const DeleteOrganizationSchema = z.object({
	orgId: z.string(),
});

export type DeleteOrganizationSchemaType = z.infer<
	typeof DeleteOrganizationSchema
>;
