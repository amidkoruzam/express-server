export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex("books").del();

  // Inserts seed entries
  await knex("books").insert([
    { title: "War and peace" },
    { title: "Idiot" },
    { title: "Hamlet" },
  ]);
};
