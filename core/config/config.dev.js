import path from "path";

const config = {};
const spaUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:3001" : "";

config.logFileDir = path.join(__dirname, "../../log");
config.logFileName = "app.log";
config.dbHost = process.env.dbHost || "localhost";
config.dbPort = process.env.dbPort || "27017";
config.dbName = process.env.dbName || "prezura";
config.serverPort = process.env.serverPort || 3000;
config.SPA_URL = spaUrl;

export default config;
