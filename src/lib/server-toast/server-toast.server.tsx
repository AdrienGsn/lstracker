import { cookies } from "next/headers";

import { ClientToasts } from "./server-toast.client";
import { ServerToastSchema } from "./server-toast.type";

async function dismissToast(id: string) {
	"use server";

	const cookieStore = await cookies();

	cookieStore.delete(id);
}

export async function ServerToaster() {
	const cookieStore = await cookies();

	const toasts = cookieStore
		.getAll()
		.filter((cookie) => cookie.name.startsWith("toast-") && cookie.value)
		.map((cookie) => {
			try {
				const parsed = ServerToastSchema.safeParse(
					JSON.parse(cookie.value)
				);

				if (!parsed.success) {
					return undefined;
				}

				return {
					id: cookie.name,
					...parsed.data,
				};
			} catch {
				return undefined;
			}
		})
		.filter((toast) => toast !== undefined);

	return <ClientToasts toasts={toasts} dismissToast={dismissToast} />;
}
