"use server";

import { sendDiscordDMAction } from "@/actions/discord/dm";
import { siteConfig } from "@/config/site";
import { getServerUrl } from "@/lib/get-server-url";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { ActionError, orgAction } from "@/lib/safe-action";
import { InviteMemberSchema } from "./schema";

export const inviteMemberAction = orgAction
	.metadata({ permissions: { invitation: ["create"] } })
	.inputSchema(InviteMemberSchema)
	.action(async ({ parsedInput: { teamId, discordId, role }, ctx }) => {
		const organizationId = ctx.session.activeOrganizationId as string;
		const organization = await prisma.organization.findUnique({
			where: { id: organizationId },
		});

		if (!organization) {
			throw new ActionError("L'organisation spécifiée est introuvable.");
		}

		let validTeamId: string | undefined = undefined;
		if (teamId && teamId.trim() !== "") {
			const team = await prisma.team.findFirst({
				where: {
					id: teamId,
					organizationId: organization.id,
				},
			});

			if (!team) {
				throw new ActionError(
					"L'équipe spécifiée n'existe pas ou n'appartient pas à cette organisation"
				);
			}

			validTeamId = teamId;
		}

		const discordAccount = await prisma.account.findFirst({
			where: { providerId: "discord", accountId: discordId },
			select: { user: { select: { email: true } } },
		});

		if (!discordAccount) {
			throw new ActionError(
				"Impossible d'inviter cet utilisateur Discord : son compte n'est pas lié à un email sur notre plateforme."
			);
		}

		const invitation = await prisma.invitation.create({
			data: {
				organizationId: organization.id,
				email: discordAccount.user.email,
				role: role,
				status: "pending",
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 jours d'expiration
				inviterId: ctx.session.userId,
				teamId: validTeamId,
			},
		});

		const inviteLink = `${getServerUrl()}/join/${invitation.id}`;

		try {
			await sendDiscordDMAction({
				accountId: discordId,
				embed: {
					title: `Invitation à rejoindre ${organization.name}`,
					description: `Vous avez été invité·e à rejoindre **${organization.name}** sur ${siteConfig.title} par ${ctx.user.name} !\n\n[Accepter l’invitation](${inviteLink})`,
					color: 0x5865f2,
					footer: {
						text: siteConfig.title,
						icon_url: `${getServerUrl()}/images/logo.svg`,
					},
					thumbnail: {
						url:
							organization.logo ??
							`${getServerUrl()}/images/logo.svg`,
					},
					fields: [
						{
							name: "Invité par",
							value: ctx.user.name,
							inline: true,
						},
						{
							name: "Organisation",
							value: organization.name,
							inline: true,
						},
					],
					timestamp: new Date().toISOString(),
				},
			});
		} catch (err: any) {
			logger.error(err);
		}

		return { success: true, invitationId: invitation.id };
	});
