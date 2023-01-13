export const up = async (knex) => {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("name");
    table.string("password");
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable("users");
};
