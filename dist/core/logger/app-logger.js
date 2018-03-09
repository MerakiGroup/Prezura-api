"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require("winston");

var winston = _interopRequireWildcard(_winston);

var _winstonDailyRotateFile = require("winston-daily-rotate-file");

var rotate = _interopRequireWildcard(_winstonDailyRotateFile);

var _config = require("../config/config.dev");

var _config2 = _interopRequireDefault(_config);

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var dir = _config2.default.logFileDir;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

var logger = new winston.Logger({
  level: "info",
  transports: [new winston.transports.Console({
    colorize: true
  }), new winston.transports.DailyRotateFile({
    filename: _config2.default.logFileName,
    dirname: _config2.default.logFileDir,
    maxsize: 20971520, //20MB
    maxFiles: 25,
    datePattern: ".dd-MM-yyyy"
  })]
});

exports.default = logger;