export function parseMetadata<T = any>(
	metadata: string | null | undefined
): T | null {
	if (!metadata) return null;

	try {
		return JSON.parse(metadata) as T;
	} catch (error) {
		console.error("Erreur lors du parsing des métadonnées:", error);
		return null;
	}
}
