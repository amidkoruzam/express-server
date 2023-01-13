export const up = async (knex) => {
  return knex.schema.createTable("books", (table) => {
    table.increments("id");
    table.string("title");
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable("books");
};
