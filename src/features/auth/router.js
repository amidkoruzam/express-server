import passport from "passport";
import crypto from "crypto";

import { apiResponse } from "../../shared/api.js";
import { logger } from "../../shared/logger.js";
import { mapUserToResponse, createUser } from "../user/index.js";

const AUTH_ERROR = {
  USER_NOT_FOUND: "user_not_found",
  COULD_NOT_LOGIN: "could_not_login",
  COULD_NOT_REGISTER: "could_not_register",
  UNKNOWN_ERROR: "unknown_error",
  MUST_BE_AUTHENTICATED: "must_be_authenticated",
  COULD_NOT_LOGOUT: "could_not_logout",
};

export const login = (req, res, next) => {
  const log = logger.child({ requestId: crypto.randomUUID() });

  passport.authenticate("local", async (err, user) => {
    if (err) {
      log.error(
        "Error while authenticating during login request. Error: %s",
        JSON.stringify(err)
      );

      return res.status(500).json(apiResponse(null, AUTH_ERROR.UNKNOWN_ERROR));
    }

    if (!user) {
      log.info("Could not find user matching login request");
      return res.status(404).json(apiResponse(null, AUTH_ERROR.USER_NOT_FOUND));
    }

    try {
      await new Promise((res, rej) =>
        req.login(user, (error) => (error ? rej(error) : res()))
      );
    } catch (error) {
      log.error(
        "User could not log in. User: %s. Error: %s",
        JSON.stringify({ id: user.id }),
        JSON.stringify(error)
      );

      return res
        .status(500)
        .json(apiResponse(null, AUTH_ERROR.COULD_NOT_LOGIN));
    }

    log.info(
      "Login request completed successfully. User: %s",
      JSON.stringify({ id: user.id })
    );

    return res.json(apiResponse(mapUserToResponse(user)));
  })(req, res, next);
};

export const register = async (req, res) => {
  const log = logger.child({ requestId: crypto.randomUUID() });
  const { name, password } = req.body;

  let user;

  try {
    user = await createUser({ name, password });

    log.info(
      "User created during register request. User: %s",
      JSON.stringify({ id: user.id })
    );
  } catch (error) {
    log.error(
      "Could not create user during register request. User: %s. Error: %s",
      JSON.stringify({ id: user.id }),
      JSON.stringify(error)
    );

    return res
      .status(500)
      .json(apiResponse(null, AUTH_ERROR.COULD_NOT_REGISTER));
  }

  try {
    await new Promise((res, rej) =>
      req.login(user, (error) => (error ? rej(error) : res()))
    );
  } catch (error) {
    log.error(
      "Could not authenticate user during register request. User: %s. Error: %s",
      JSON.stringify({ id: user.id }),
      JSON.stringify(error)
    );

    return res.status(500).json(apiResponse(null, AUTH_ERROR.COULD_NOT_LOGIN));
  }

  log.info(
    "Register new user request completed successfully. User: %s",
    JSON.stringify({ id: user.id })
  );

  return res.json(apiResponse(mapUserToResponse(user)));
};

export const logout = async (req, res) => {
  try {
    await new Promise((res, rej) =>
      req.logout((error) => (error ? rej(error) : res()))
    );
  } catch (error) {
    log.error(
      "Could not logout user during logout logout. User: %s. Error: %s",
      JSON.stringify({ id: user.id }),
      JSON.stringify(error)
    );

    return res.status(500).json(apiResponse(null, AUTH_ERROR.COULD_NOT_LOGOUT));
  }

  log.info(
    "Logout request completed successfully. User: %s",
    JSON.stringify({ id: user.id })
  );

  return res.sendStatus(200);
};

export const self = (req, res) =>
  res.json(apiResponse(mapUserToResponse(req.user)));

export const allowOnlyAuthenticated = (req, res, next) => {
  if (req.user) return next();

  return res
    .status(401)
    .send(apiResponse(null, AUTH_ERROR.MUST_BE_AUTHENTICATED));
};
