import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

import { getUserById, getUserByName } from "../user/index.js";
import { verifyPassword } from "./lib.js";

export const initAuth = (app) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "name" },
      async (username, password, done) => {
        const user = await getUserByName(username);

        if (!user) return done(null, false);

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) return done(null, false);

        return done(null, user);
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    const user = await getUserById(id);
    if (!user) return done(null, false);
    return done(null, user);
  });

  app.use(
    session({
      name: "qid",
      secret: "secret",
      saveUninitialized: false,
      resave: false,
    })
  );

  app.use(passport.authenticate("session"));
};
