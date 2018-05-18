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
import { Server } from "ws";

const wss = new Server({ port: 7171 });

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

// app.use(filter());

// app.use(helmet.xssFilter());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.noSniff());

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

let clients = [];

wss.on("connection", function connection(ws, req) {
  const ip = req.connection.remoteAddress;
  ws.on("message", data => {
    console.log("67890", data);
    for (let i = 0; i < clients.length; i++) {
      const dataArray = JSON.parse(data);

      const pressureData = [];
      // for (let i = 0; i < dataArray.length; i++) {
      pressureData.push({
        value: dataArray[0] / 4,
        x: 60,
        y: 200
      });

      pressureData.push({
        value: dataArray[1] / 4,
        x: 40,
        y: 100
      });

      pressureData.push({
        value: dataArray[2] / 4,
        x: 80,
        y: 90
      });

      pressureData.push({
        value: dataArray[3] / 4,
        x: 60,
        y: 150
      });
      // }
      clients[i].emit("data", {
        data: pressureData
      });
      // console.log("data", data);
    }
  });
});

socketio.on("connection", socket => {
  clients.push(socket);

  // console.log(socket);
  let connected = true;
  console.log("joined");
  socket.on("disconnect", () => {
    connected = false;
    socketio.emit("disconnected", { user: "user-disconnected" });
    console.log("Disconnected");

    clients.splice(clients.indexOf(socket), 1);
  });

  // socket.on("getData", () => {
  //   const intervalID = setInterval(() => {
  //     if (connected) {
  //       socketio.emit("data", { data: generatePoints() });

  //       console.log("Heat map data sent");
  //     } else {
  //       clearInterval(intervalID);
  //     }
  //   }, 1200);
  // });

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
      value: getRandomInt(255),
      x: getRandomInt(600),
      y: getRandomInt(600)
    });
  }
  return points;
};

let calculateTheSurroundNodePressure = data => {};

let getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

let getDateTimeString = () => {
  const date = new Date();
  return `${date.getHours()} : ${date.getMinutes()}: ${date.getSeconds()}`;
};
