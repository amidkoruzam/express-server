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
  let logOpts = { requestId: crypto.randomUUID(), path: req.path };

  passport.authenticate("local", async (err, user) => {
    if (err) {
      logger.error(err, logOpts);
      return res.status(500).json(apiResponse(null, AUTH_ERROR.UNKNOWN_ERROR));
    }

    if (!user) {
      logger.info("user not found", logOpts);
      return res.status(404).json(apiResponse(null, AUTH_ERROR.USER_NOT_FOUND));
    }

    logOpts = { ...logOpts, user: { id: user.id } };

    try {
      await new Promise((res, rej) =>
        req.login(user, (error) => (error ? rej(error) : res()))
      );
    } catch (error) {
      logger.error(error, logOpts);

      return res
        .status(500)
        .json(apiResponse(null, AUTH_ERROR.COULD_NOT_LOGIN));
    }

    logger.info("user logged in", logOpts);
    return res.json(apiResponse(mapUserToResponse(user)));
  })(req, res, next);
};

export const register = async (req, res) => {
  let logOpts = { requestId: crypto.randomUUID(), path: req.path };
  const { name, password } = req.body;

  let user;

  try {
    user = await createUser({ name, password });

    logOpts = { ...logOpts, user: { id: user.id } };
    logger.info("new user created", logOpts);
  } catch (error) {
    log.error(error, logOpts);

    return res
      .status(500)
      .json(apiResponse(null, AUTH_ERROR.COULD_NOT_REGISTER));
  }

  try {
    await new Promise((res, rej) =>
      req.login(user, (error) => (error ? rej(error) : res()))
    );
  } catch (error) {
    logger.error(error, logOpts);
    return res.status(500).json(apiResponse(null, AUTH_ERROR.COULD_NOT_LOGIN));
  }

  logger.info("user registered", logOpts);
  return res.json(apiResponse(mapUserToResponse(user)));
};

export const logout = async (req, res) => {
  let logOpts = { user: { id: req.user?.id } };

  try {
    await new Promise((res, rej) =>
      req.logout((error) => (error ? rej(error) : res()))
    );
  } catch (error) {
    logger.error(error, logOpts);

    return res.status(500).json(apiResponse(null, AUTH_ERROR.COULD_NOT_LOGOUT));
  }

  logger.info("user logged out", logOpts);
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
