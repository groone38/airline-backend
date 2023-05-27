import { Request, Response, Router } from "express";
import { getCompany, getUsers, getUsersInCompany } from "../database";

export const usersRouter = Router();
const jwt = require("jsonwebtoken");

usersRouter.get("/", async (req: Request, res: Response) => {
  const users = await getUsers();
  res.send(users);
});
