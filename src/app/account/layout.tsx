import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AccountHeader } from "@/features/account/account-header";
import { AccountSidebar } from "@/features/account/account-sidebar";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { LayoutParams } from "@/types/next";
import { cookies } from "next/headers";

export default async function RoutePage(props: LayoutParams) {
	const { user } = await requiredCurrentUserCache();

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AccountSidebar />
			<SidebarInset className="relative">
				<AccountHeader />
				<main className="flex-1">{props.children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
