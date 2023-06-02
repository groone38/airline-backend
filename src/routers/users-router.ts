import { Request, Response, Router } from "express";
import {
  getCompany,
  getCompanyOne,
  getUsers,
  getUsersInCompany,
  registrUser,
} from "../database";

export const usersRouter = Router();
const jwt = require("jsonwebtoken");

export const authenticateJWT = (req: any, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
  console.log("qwe");
  if (authHeader) {
    // const token = authHeader.split(" ")[1];
    const token = authHeader;

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;

      next();
    });
  } else {
    res.sendStatus(401);
  }
};

usersRouter.get(
  "/:id/users",
  authenticateJWT,
  async (req: Request, res: Response) => {
    const company = await getCompanyOne(req.params.id);
    const users = await getUsersInCompany(company[0].id);
    res.status(200).json(users);
  }
);

usersRouter.post("/", authenticateJWT, async (req: Request, res: Response) => {
  const user = await registrUser(req.body);

  if (user === "error") {
    res.status(403).json({
      message: "This user already exists",
    });
  } else if (user === "Not found Company!") {
    res.status(404).json({
      message: "Not found Company!",
    });
  } else {
    res.status(200).json({
      message: "Registr complite",
    });
  }
});
