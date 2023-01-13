import bcrypt from "bcrypt";

export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex("users").del();

  const password = await bcrypt.hash("password", 10);

  // Inserts seed entries
  await knex("users").insert([{ name: "dima", password }]);
};
