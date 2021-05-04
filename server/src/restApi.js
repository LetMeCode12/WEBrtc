const UserController = require("./sequelize/Controllers/UserController");

const restApi = (app) => {
  app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>");
  });

  app.get("/users", UserController.getAll);

  app.post("/user/register", UserController.create);
};

module.exports = {
  restApi,
};
