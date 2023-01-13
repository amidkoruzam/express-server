export const allowOnlyAuthenticated = (req, res, next) => {
  if (req.session.userId) next();
  res.status(401).send("Access forbidden.");
};
