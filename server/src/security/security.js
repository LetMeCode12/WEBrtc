const { compare } = require("./securityUtils");
const JWT = require("jsonwebtoken");
const nodeCache = require("node-cache");
const { generateToken } = require("./jwt");

const refreshTokens = new nodeCache({
  stdTTL: +process.env.REFRESH_TOKEN_EXPIRE,
  checkperiod: 120,
});

module.exports = (app) => {
  app.post("/login", async (req, res) => {
    const { login, password } = req.body;
    if (await compare(login, password,res)) {
      const authToken = generateToken(login);
      const refreshToken = JWT.sign(
        { username: login },
        process.env.REFRESH_TOKEN_SECRET
      );
      refreshTokens.set(refreshToken);
      res.json({
        auth: authToken,
        refreshToken: refreshToken,
      });

      return res.status(200).send("ok");
    }
    return res.status(401).send();
  });

  app.post("/token", (req, res) => {
    const _refreshToken = req.body.refreshToken;
    if (!_refreshToken) return res.status(401).send();
    if (!refreshTokens.keys().includes(_refreshToken))
      return res.status(403).send();
    JWT.verify(_refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send();
      const accessToken = generateToken(user.username);
      const refreshToken = JWT.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET
      );
      refreshTokens.set(refreshToken);
      res.json({
        auth: accessToken,
        refreshToken: refreshToken,
      });

      return res.status(200).send("ok");
    });
  });
};
