import { Breadcrumb } from "@/components/page/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AdminHeader = () => {
	return (
		<header className="flex items-center gap-4 w-full p-4">
			<SidebarTrigger />
			<Breadcrumb />
		</header>
	);
};
