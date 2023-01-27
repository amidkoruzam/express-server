import Winston, { format } from "winston";

const formatting = format.combine(
  format.timestamp(),
  format.splat(),
  format.simple(),
  format.errors({ stack: true })
);

const options = {
  error: {
    level: "error",
    format: formatting,
    filename: "tmp/log/errors.log",
  },

  file: {
    format: formatting,
    filename: "tmp/log/combined.log",
  },

  console: {
    format: format.combine(formatting, format.prettyPrint()),
  },
};

const config = {
  transports: [
    new Winston.transports.File(options.file),
    new Winston.transports.File(options.error),
  ],
};

if (process.env.MODE === "development") {
  config.transports.push(new Winston.transports.Console(options.console));
}

export const logger = Winston.createLogger(config);
