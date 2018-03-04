import Mongoose from "mongoose";
import config from "../core/config/config.dev";

Mongoose.Promise = global.Promise;

const connectToDb = async () => {
  const dbHost = config.dbHost;
  const dbPort = config.dbPort;
  const dbName = config.dbName;
  try {
    await Mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
      useMongoClient: true
    });
  } catch (err) {
    console.log("Error occured", err);
  }
};

export default connectToDb;
