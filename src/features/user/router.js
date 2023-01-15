import { apiResponse } from "../../shared/api.js";
import { mapUserToResponse } from "./lib.js";
import { getUsers } from "./repository.js";

export const showUsers = async (req, res) => {
  const users = await getUsers();
  return res.send(apiResponse(users.map(mapUserToResponse)));
};

export const deleteUser = async (req, res) => {
  await removeUserById(req.id);
  return res.sendStatus(200);
};
