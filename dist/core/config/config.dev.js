"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {};
var spaUrl = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

config.logFileDir = _path2.default.join(__dirname, "../../log");
config.logFileName = "app.log";
config.dbHost = process.env.dbHost || "localhost";
config.dbPort = process.env.dbPort || "27017";
config.dbName = process.env.dbName || "prezura";
config.serverPort = process.env.serverPort || 3000;
config.SPA_URL = spaUrl;

exports.default = config;