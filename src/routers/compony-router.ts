import { Request, Response, Router } from "express";
import { getCompany, getCompanyOne, getUsersInCompany } from "../database";

export const componyRouter = Router();

componyRouter.get("/", async (req: Request, res: Response) => {
  const company = await getCompany();
  res.status(200).json(company);
});

componyRouter.get("/:id/users", async (req: Request, res: Response) => {
  const company = await getCompanyOne(req.params.id);
  const users = await getUsersInCompany(company[0].id);
  res.status(200).json(users);
});
