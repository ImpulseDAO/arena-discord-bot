import pgPromise from "pg-promise"
import { connectionString } from "./dbConfig"

export const db = pgPromise()(connectionString);

db.connect()
  .then(() => {
    console.info("Connected to database");
  })
  .catch(error => {
    console.info("Error connecting to DB:", error.message || error);
  });
