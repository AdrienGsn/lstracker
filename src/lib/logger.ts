import { Logger } from "tslog";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = new Logger({
    stylePrettyLogs: isDevelopment,
    minLevel: isDevelopment ? 0 : 3,
});
