import { z } from "zod";

export const FamtomeSchema = z.object({
	lat: z.float32(),
	lng: z.float32(),
});

export type FantomeSchemaType = z.infer<typeof FamtomeSchema>;
