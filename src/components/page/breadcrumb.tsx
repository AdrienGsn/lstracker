"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as UIBreadcrumb,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

const ITEMS_TO_DISPLAY = 3;

export type BreadcrumbProps = {
	capitalizeLinks?: boolean;
};

export const Breadcrumb = ({ capitalizeLinks }: BreadcrumbProps) => {
	const paths = usePathname();
	const isMobile = useIsMobile();

	const [open, setOpen] = useState(false);

	const pathNames = paths.split("/").filter((path) => path);

	return (
		<UIBreadcrumb>
			<BreadcrumbList className="gap-2 rounded-md border px-3 h-8 text-sm">
				<BreadcrumbItem>
					<BreadcrumbLink href="/">
						<HomeIcon className="size-4" />
						<span className="sr-only">Home</span>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				{pathNames.map((link, index) => {
					const href = `/${pathNames.slice(0, index + 1).join("/")}`;

					let itemLink = capitalizeLinks
						? link[0].toUpperCase() + link.slice(1, link.length)
						: link;

					if (itemLink.length > 10) {
						itemLink = `${link.slice(0, 3)}...${link.slice(
							link.length - 3,
							link.length
						)}`;
					}

					if (
						pathNames.length > ITEMS_TO_DISPLAY &&
						index !== 0 &&
						index !== pathNames.length - 1
					) {
						return (
							<div
								key={index}
								className="flex items-center gap-1"
							>
								<BreadcrumbItem>
									<DropdownMenu>
										<DropdownMenuTrigger className="flex items-center gap-1">
											<BreadcrumbEllipsis className="size-4" />
											<span className="sr-only">
												Toggle menu
											</span>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start">
											{pathNames
												.filter(
													(link, index) =>
														index !== 0 &&
														index !==
															pathNames.length - 1
												)
												.map((link, index) => (
													<DropdownMenuItem
														key={index}
													>
														<Link href={href}>
															{itemLink}
														</Link>
													</DropdownMenuItem>
												))}
										</DropdownMenuContent>
									</DropdownMenu>
								</BreadcrumbItem>
								{pathNames.length !== index + 1 && (
									<BreadcrumbSeparator />
								)}
							</div>
						);
					}

					return (
						<div key={index} className="flex items-center gap-1">
							<BreadcrumbItem key={index}>
								{paths === href ? (
									<BreadcrumbPage>{itemLink}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>{itemLink}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{pathNames.length !== index + 1 && (
								<BreadcrumbSeparator />
							)}
						</div>
					);
				})}
			</BreadcrumbList>
		</UIBreadcrumb>
	);
};
