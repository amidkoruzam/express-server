import express from "express";

import {
  allowOnlyAuthenticated,
  initAuth,
  login,
  logout,
  register,
} from "./features/auth/index.js";
import { self } from "./features/auth/router.js";
import { showUsers } from "./features/user/router.js";

const app = express();

initAuth(app);

app.use(express.json());

app.post("/register", register);
app.post("/login", login);
app.get("/logout", logout);

app.get("/self", allowOnlyAuthenticated, self);

app.get("/users", allowOnlyAuthenticated, showUsers);

app.listen(3000);
