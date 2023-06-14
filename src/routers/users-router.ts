import { Request, Response, Router } from "express";
import {
  deleteUser,
  getUserOne,
  getUsersInCompany,
  putUser,
  registrUser,
} from "../database";

export const usersRouter = Router();
const jwt = require("jsonwebtoken");

export const authenticateJWT = (req: any, res: Response, next: any) => {
  const authHeader = req.headers.authorization;
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
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    // const company = await getCompanyOne(req.params.id);
    const users = await getUsersInCompany(req.params.id);
    res.status(200).json(users);
  }
);

usersRouter.post(
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
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
      const result = await getUsersInCompany(req.params.id);
      res.status(200).json({
        data: result,
        message: "Registr complite",
      });
    }
  }
);

usersRouter.put(
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    const userFind = await getUserOne(req.params.id);
    if (userFind.length > 0) {
      await putUser(req.params.id, req.body);
      res.status(200).json({
        message: "Update user success!",
      });
    }
  }
);

usersRouter.delete(
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response) => {
    const userFind = await getUserOne(req.params.id);
    if (userFind.length > 0) {
      await deleteUser(req.params.id).then(() =>
        res.status(200).json({
          message: "User delete",
        })
      );
    } else {
      res.status(404).json({
        message: "Not found user",
      });
    }
  }
);
