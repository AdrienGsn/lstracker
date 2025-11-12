import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export type LogoProps = {
	className?: string;
	showTitle?: boolean;
};

export const Logo = (props: LogoProps) => {
	return (
		<Link href="/" className="inline-flex items-center gap-1">
			<div className={cn("relative block size-10", props.className)}>
				<Image src="/images/logo.svg" alt={siteConfig.title} fill />
			</div>
			{props.showTitle ? (
				<p className="text-xl font-bold">{siteConfig.title}</p>
			) : null}
		</Link>
	);
};
