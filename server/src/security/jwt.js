const JWT = require("jsonwebtoken");

module.exports.authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send();
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send();
    req.user = user;
    next();
  });
};

module.exports.generateToken = (username) => {
  return JWT.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: +process.env.ACCESS_TOKEN_EXPIRE,
  });
};
