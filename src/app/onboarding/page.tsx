import { OnBoarding } from "@/features/on-boarding";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { PageParams } from "@/types/next";

export default async function RoutePage(props: PageParams) {
	const { user } = await requiredCurrentUserCache();

	return <OnBoarding />;
}
