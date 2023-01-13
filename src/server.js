import express from "express";
import bcrypt from "bcrypt";
import session from "express-session";

import { db } from "./db.js";
import { allowOnlyAuthenticated } from "./features/auth/index.js";

const app = express();

app.use(express.json());
app.use(
  session({
    name: "qid",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);

app.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.table("users").insert({ name, password: hashedPassword });
  return res.send("success");
});

app.post("/login", async (req, res) => {
  if (req.session.userId) return res.status(200).send("already authenticated");

  const { name, password } = req.body;
  const user = await db("users").where({ name }).first();

  if (!user) return res.status(404).send("could not find user");

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) return res.status(404).send("password is not valid");

  req.session.userId = user.id;
  return res.json(user);
});

app.get("/users", allowOnlyAuthenticated, async (req, res) => {
  if (!req.session.userId) res.status(400).send("forbidden");

  const users = await db("users").select();
  return res.send(users);
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  return res.status(200).send();
});

app.listen(3000);
