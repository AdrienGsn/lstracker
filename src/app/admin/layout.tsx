import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/features/admin/admin-header";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { LayoutParams } from "@/types/next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function RoutePage(props: LayoutParams) {
	const { user } = await requiredCurrentUserCache();

	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	if (user?.role !== "admin") {
		return notFound();
	}

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AdminSidebar />
			<SidebarInset className="relative">
				<AdminHeader />
				<main className="flex-1">{props.children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
