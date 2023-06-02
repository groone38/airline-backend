import { Request, Response, Router } from "express";
import { getCompany, getCompanyOne, getUsersInCompany } from "../database";

export const componyRouter = Router();
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
      // console.log(req.user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

componyRouter.get("/", authenticateJWT, async (req: Request, res: Response) => {
  const company = await getCompany();
  res.status(200).json(company);
});
