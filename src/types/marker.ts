import { Marker, Organization, Team, User } from "@prisma/client";

export type MarkerWithRelations = Marker & {
	user: User;
	organization: Organization;
	team: Team;
};

export type MarkerWithUser = Marker & { user: User };
