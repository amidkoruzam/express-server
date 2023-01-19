import Winston, { format } from "winston";

export const logger = Winston.createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [new Winston.transports.Console()],
});
