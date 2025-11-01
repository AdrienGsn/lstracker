import { SidebarTrigger } from "@/components/ui/sidebar";

export const MainHeader = () => {
	return (
		<header className="flex items-center justify-between w-full z-50 p-4 absolute top-0 left-0">
			<SidebarTrigger />
		</header>
	);
};
