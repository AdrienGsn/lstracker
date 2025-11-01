import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { OrganizationWithMembers } from "@/types/organization";

export type UserOrganizationsCardProps = {
	organizations: OrganizationWithMembers[];
};

export const UserOrganizationsCard = (props: UserOrganizationsCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Organizations</CardTitle>
				<CardDescription>
					Organizations this user belong to
				</CardDescription>
			</CardHeader>
			<CardContent>
				{props.organizations.map((org) => (
					<Item key={org.id} variant="outline">
						<ItemMedia>
							<Avatar className="size-10">
								{org.logo ? (
									<AvatarImage src={org.logo} />
								) : (
									<AvatarFallback>
										{org.name.slice(0, 2).toUpperCase()}
									</AvatarFallback>
								)}
							</Avatar>
						</ItemMedia>
						<ItemContent>
							<ItemTitle className="font-bold">
								{org.name}
							</ItemTitle>
							<ItemDescription>
								Role: {org.members[0].role}
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Link
								href={`/admin/organizations/${org.id}`}
								className={cn(
									buttonVariants({
										variant: "outline",
									})
								)}
							>
								<ExternalLink />
								View
							</Link>
						</ItemActions>
					</Item>
				))}
			</CardContent>
		</Card>
	);
};
