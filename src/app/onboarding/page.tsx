import { Metadata } from "next";

import { OnBoarding } from "@/features/on-boarding";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { PageParams } from "@/types/next";

export const metadata: Metadata = {
	title: "Premiers pas",
};

export default async function RoutePage(props: PageParams) {
	const { user } = await requiredCurrentUserCache();

	return <OnBoarding />;
}
