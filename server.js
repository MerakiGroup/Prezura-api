import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import http from "http";
import io from "socket.io";
import logger from "./core/logger/app-logger";
import session from "express-session";
import config from "./core/config/config.dev";
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
const server = http.createServer(app);
const socketio = io.listen(server);

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

server.listen(port, () => {
  logger.info("server started - ", port);
});

socketio.on("connection", socket => {
  console.log("joined");
  socket.on("disconnect", () => {
    socketio.emit("disconnected", { user: "user-disconnected" });
  });

  setInterval(() => {
    socketio.emit("data", { data: generatePoints() });
    console.log("sent");
  }, 1200);
});

let generatePoints = () => {
  const points = [];

  for (let i = 0; i < 500; i++) {
    points.push({
      value: getRandomInt(5),
      x: getRandomInt(600),
      y: getRandomInt(600)
    });
  }
  return points;
};

let getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};
