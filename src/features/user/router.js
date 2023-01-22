import { apiResponse } from "../../shared/api.js";
import { logger } from "../../shared/logger.js";
import { mapUserToResponse } from "./lib.js";
import { getUsers } from "./repository.js";

const ERROR = {
  COULD_NOT_DELETE_USER: "could_not_delete_user",
};

export const showUsers = async (req, res) => {
  const users = await getUsers();
  return res.send(apiResponse(users.map(mapUserToResponse)));
};

export const deleteUser = async (req, res) => {
  const logOpts = {
    requestId: crypto.randomUUID(),
    user: { id: req.user?.id },
    path: req.path,
    deleting: { id: req.params.id },
  };

  try {
    await removeUserById(req.id);
  } catch (error) {
    logger.error(error, logOpts);
    return res.status(500).send(apiResponse(null, COULD_NOT_DELETE_USER));
  }

  logger.info("user deleted", logOpts);

  return res.sendStatus(200);
};
