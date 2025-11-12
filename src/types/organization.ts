import { Member, Organization, Team, TeamMember, User } from "@prisma/client";
import { MarkerWithUser } from "./marker";

export type OrganizationWithMembers = Organization & {
	members: Member[];
};

export type MemberWithUser = Member & {
	user: User & {
		teamMembers: (TeamMember & { team: Team })[];
	};
};

export type MemberWithTeam = Member & {
	user: User;
	team: Team;
};

export type TeamWithMembersAndMarkers = Team & {
	members: TeamMemberWithUser[];
	markers: MarkerWithUser[];
};

export type TeamMetadata = {
	icon?: string;
};

export type TeamMemberWithUser = TeamMember & { user: User };
