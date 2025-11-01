/**
 * Sends a message to a specific channel in a specific Discord server (guild).
 *
 * @param {string} token - Discord bot token.
 * @param {string} guildId - The ID of the Discord server (guild).
 * @param {string} channelId - The ID of the channel within the server.
 * @param {string} message - The message content to send.
 * @returns {Promise<object>} - The API response.
 */
export async function sendDiscordMessage({
	guildId,
	channelId,
	message,
}: {
	guildId: string;
	channelId: string;
	message: string;
}): Promise<object> {
	const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
	const token = process.env.DISCORD_BOT_TOKEN as string;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bot ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: message,
		}),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));

		throw new Error(
			`Failed to send Discord message: ${response.status} ${response.statusText}` +
				(errorData && errorData.message
					? ` - ${errorData.message}`
					: "")
		);
	}

	return response.json();
}
