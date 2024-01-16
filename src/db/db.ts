import pgPromise from "pg-promise"
import { connectionString } from "./dbConfig"

export const db = pgPromise()(connectionString);

db.connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch(error => {
    console.log("Error connecting to DB:", error.message || error);
  });
