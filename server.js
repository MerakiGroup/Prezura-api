import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "./core/logger/app-logger";

import session from "express-session";
import config from "./core/config/config.dev";
// import cars from "./routes/cars.route";
import connectToDb from "./db/connect";

// const session = require("express-session");

//routes
import user from "./routes/user.routes";

const port = config.serverPort;
logger.stream = {
  write(message, encoding) {
    logger.info(message);
  }
};

connectToDb();

const app = express();

app.use(session({ secret: "prezuracx" })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev", { stream: logger.stream }));

app.use("/api/user", user);

// Index route
app.get("/", (req, res) => {
  res.send("Invalid endpoint!");
});

app.listen(port, () => {
  logger.info("server started - ", port);
});
