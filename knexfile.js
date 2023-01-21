export default {
  development: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./migrations",
      extension: "mjs",
      loadExtensions: [".mjs"],
    },
    seeds: {
      directory: "./seeds",
      extension: "mjs",
      loadExtensions: [".mjs"],
    },
  },
};
