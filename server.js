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
  let connected = true;
  console.log("joined");
  socket.on("disconnect", () => {
    connected = false;
    socketio.emit("disconnected", { user: "user-disconnected" });
    console.log("Disconnected");
  });

  socket.on("getData", () => {
    const intervalID = setInterval(() => {
      if (connected) {
        socketio.emit("data", { data: generatePoints() });
        console.log("Heat map data sent");
      } else {
        clearInterval(intervalID);
      }
    }, 1200);
  });

  socket.on("getPressureData", () => {
    const intervalID = setInterval(() => {
      if (connected) {
        const label = getDateTimeString();
        const left = getRandomInt(100);
        const right = getRandomInt(100);
        const data = {
          left,
          right
        };
        socketio.emit("pressureDiff", { data, label });
        console.log("Pressure diff data sent");
      } else {
        clearInterval(intervalID);
      }
    }, 1800);
  });
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

let getDateTimeString = () => {
  const date = new Date();
  return `${date.getHours()} : ${date.getMinutes()}: ${date.getSeconds()}`;
}
