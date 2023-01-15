import { db } from "../../db.js";
import { hashPassword } from "./lib.js";

export const getUserByName = (name) => db.first().from("users").where({ name });

export const getUserById = (id) => db.first().from("users").where({ id });

export const createUser = async ({ name, password }) => {
  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .table("users")
    .insert({ name, password: hashedPassword })
    .returning(["id", "name"]);

  return user;
};

export const removeUserById = (id) => db.delete({ id }).from("users");

export const getUsers = () => db("users").select();
