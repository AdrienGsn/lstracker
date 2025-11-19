import { Breadcrumb } from "@/components/page/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const MainHeader = () => {
	return (
		<header className="flex items-center gap-4 w-full p-2 sticky top-0 backdrop-blur-2xl z-50">
			<SidebarTrigger variant="secondary" size="icon" />
			<Breadcrumb />
		</header>
	);
};
