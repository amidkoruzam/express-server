import bcrypt from "bcrypt";

export const hashPassword = (password) => bcrypt.hash(password, 10);

export const checkIfPasswordMatchesToHash = (passwordToCheck, hashedPassword) =>
  bcrypt.compare(passwordToCheck, hashedPassword);

export const mapUserToResponse = (user) => ({ id: user.id, name: user.name });
