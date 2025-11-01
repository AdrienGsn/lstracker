import { Member, Organization } from "@prisma/client";

export type OrganizationWithMembers = Organization & {
	members: Member[];
};
