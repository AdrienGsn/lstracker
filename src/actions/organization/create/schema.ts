import { z } from "zod";
export const CreateOrgSchema = z.object({
	name: z
		.string({ error: "Veuillez entrer un nom" })
		.min(3, "Le nom doit contenir au moins 3 caractères")
		.max(50, "Le nom ne peut pas dépasser 50 caractères")
		.regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/, {
			message: "Le nom ne doit pas contenir de caractères spéciaux",
		}),
	slug: z
		.string({ error: "Veuillez entrer un slug" })
		.min(3, "Le slug doit contenir au moins 3 caractères")
		.max(50, "Le slug ne peut pas dépasser 50 caractères")
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			"Le slug doit être en minuscules et ne peut contenir que des lettres, des chiffres et des tirets"
		),
	files: z
		.array(z.instanceof(File))
		.max(1, "Un seul fichier est autorisé")
		.refine(
			(files) =>
				files.every((file) => file && file.size <= 2 * 1024 * 1024),
			{
				message: "File size must be less than 2MB",
				path: ["files"],
			}
		)
		.optional(),
	guildId: z
		.string()
		.min(1, "Veuillez sélectionner un serveur Discord")
		.regex(/^\d+$/, "L'ID du serveur Discord doit être valide"),
});

export type CreateOrgSchemaType = z.infer<typeof CreateOrgSchema>;
