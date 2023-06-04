import { Request, Response, Router } from "express";
import {
  createCompany,
  getCompany,
  getCompanyOne,
  getUsersInCompany,
} from "../database";
import { ICompany } from "../models/Company";

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

componyRouter.post(
  "/",
  authenticateJWT,
  async (req: Request, res: Response) => {
    const companyAPI = await getCompany().then((res) => {
      return res.find(
        (item: ICompany) => item.name_company === req.body["name_company"]
      );
    });
    if (companyAPI) {
      res.status(404).json({
        message: "This company already exists",
      });
    } else {
      const result = await createCompany(req.body["name_company"]);
      res.status(200).json({
        data: result,
        message: "Create company success!",
      });
    }
  }
);
