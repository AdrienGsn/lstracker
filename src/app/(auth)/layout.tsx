import { redirect } from "next/navigation";

import { authConfig } from "@/config/auth";
import { currentUserCache } from "@/lib/cache";
import type { LayoutParams } from "@/types/next";

export default async function Layout(props: LayoutParams) {
	const { user } = await currentUserCache();

	if (user) {
		return redirect(authConfig.callbackUrl);
	}

	return props.children;
}
