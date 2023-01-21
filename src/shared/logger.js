import Winston, { format } from "winston";

const formatting = format.combine(
  format.timestamp(),
  format.splat(),
  format.simple()
);

const options = {
  file: {
    format: formatting,
    filename: "log.txt",
  },

  console: {
    format: format.combine(formatting, format.prettyPrint()),
  },
};

const config = {
  transports: [],
};

if (process.env.MODE === "development") {
  config.transports.push(new Winston.transports.Console(options.console));
}

if (process.env.MODE === "production") {
  config.transports.push(new Winston.transports.File(options.file));
}

export const logger = Winston.createLogger(config);
