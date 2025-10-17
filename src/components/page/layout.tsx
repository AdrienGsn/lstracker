import twx from "@/lib/twx";

export const Layout = twx.div((props) => [
	"flex-wrap w-full max-w-7xl flex gap-6 mx-auto px-4 my-4",
	props.className,
]);

export const LayoutHeader = twx.div((props) => [
	"flex items-start gap-1 flex-col w-full md:flex-1 min-w-[200px]",
	props.className,
]);

export const LayoutTitle = twx.h1((props) => [
	"text-4xl font-bold",
	props.className,
]);

export const LayoutDescription = twx.p((props) => ["text-md", props.className]);

export const LayoutActions = twx.div((props) => [
	"flex items-center gap-2",
	props.className,
]);

export const LayoutContent = twx.div((props) => ["w-full", props.className]);
