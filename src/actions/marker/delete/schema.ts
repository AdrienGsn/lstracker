import { z } from "zod";

export const DeleteMarkerSchema = z.object({
	markerId: z.string(),
});

export type DeleteMarkerSchemaType = z.infer<typeof DeleteMarkerSchema>;
