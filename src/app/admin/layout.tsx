import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "@/features/admin/admin-header";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { requiredCurrentUserCache } from "@/lib/cache";
import type { LayoutParams } from "@/types/next";
import { notFound } from "next/navigation";

export default async function RoutePage(props: LayoutParams) {
	const { user } = await requiredCurrentUserCache();

	if (user?.role !== "admin") {
		return notFound();
	}

	return (
		<SidebarProvider>
			<AdminSidebar />
			<SidebarInset className="relative">
				<AdminHeader />
				<main className="flex-1">{props.children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
