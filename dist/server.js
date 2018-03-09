"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _swaggerJsdoc = require("swagger-jsdoc");

var _swaggerJsdoc2 = _interopRequireDefault(_swaggerJsdoc);

var _swaggerUiExpress = require("swagger-ui-express");

var _swaggerUiExpress2 = _interopRequireDefault(_swaggerUiExpress);

var _appLogger = require("./core/logger/app-logger");

var _appLogger2 = _interopRequireDefault(_appLogger);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require("./core/config/config.dev");

var _config2 = _interopRequireDefault(_config);

var _connect = require("./db/connect");

var _connect2 = _interopRequireDefault(_connect);

var _user = require("./routes/user.routes");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import cars from "./routes/cars.route";
var port = _config2.default.serverPort;

// const session = require("express-session");

//routes

_appLogger2.default.stream = {
  write: function write(message, encoding) {
    _appLogger2.default.info(message);
  }
};

(0, _connect2.default)();

var app = (0, _express2.default)();

app.use((0, _expressSession2.default)({ secret: "prezuracx" })); // session secret
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, _morgan2.default)("dev", { stream: _appLogger2.default.stream }));

app.use("/api/user", _user2.default);

// Index route
app.get("/", function (req, res) {
  res.send("Invalid endpoint!");
});

app.listen(port, function () {
  _appLogger2.default.info("server started - ", port);
});