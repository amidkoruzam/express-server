import bcrypt from "bcrypt";

export const verifyPassword = (passwordToCheck, hashedPassword) =>
  bcrypt.compare(passwordToCheck, hashedPassword);
