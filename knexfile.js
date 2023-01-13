// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "pg",
    connection: {
      host: "db",
      port: 5432,
      user: "postgres",
      password: "password",
      database: "postgres",
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
