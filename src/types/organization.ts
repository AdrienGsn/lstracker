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

export type TeamWithRelations = Team & {
	members: TeamMemberWithUser[];
	markers: MarkerWithUser[];
	organization: Organization & {
		members: MemberWithUser[];
	};
};

export type TeamMetadata = {
	icon?: string;
};

export type TeamMemberWithUser = TeamMember & { user: User };
