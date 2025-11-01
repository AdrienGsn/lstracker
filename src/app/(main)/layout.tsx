import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MainHeader } from "@/features/main/main-header";
import { MainSidebar } from "@/features/main/main-sidebar";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { LayoutParams } from "@/types/next";

export default async function RoutePage(props: LayoutParams) {
	const { user } = await requiredCurrentUserCache();

	return (
		<SidebarProvider>
			<MainSidebar />
			<SidebarInset className="relative">
				<MainHeader />
				<main className="flex-1">{props.children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
