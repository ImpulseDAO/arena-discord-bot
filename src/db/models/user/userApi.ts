import { db } from "../../db"
import { UserAPI } from "./user"

export const userApi = new UserAPI(db)
