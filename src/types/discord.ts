export type DiscordMember = {
	user: {
		id: string;
		username: string;
		discriminator: string;
		avatar: string | null;
		bot?: boolean;
		global_name?: string;
		email: string;
	};
	nick: string | null;
	roles: string[];
	joined_at: string;
	premium_since: string | null;
	deaf: boolean;
	mute: boolean;
	pending?: boolean;
	permissions?: string;
};

export type FormattedDiscordMember = {
	id: string;
	email: string;
	username: string;
	discriminator: string;
	displayName: string;
	avatar: string | null;
	avatarUrl: string | null;
	isBot: boolean;
	nickname: string | null;
	roles: string[];
	joinedAt: string;
	isPremium: boolean;
};
