import { Request, Response, Router } from "express";
import {
  createUser,
  getCompany,
  getUsers,
  getUsersInCompany,
} from "../database";

export const usersRouter = Router();

usersRouter.get("/", async (req: Request, res: Response) => {
  const users = await getUsers();
  console.log(users);
  res.send(users);
});

usersRouter.post("/", async (req: Request, res: Response) => {
  const password = req.body.password;
  const confirm = req.body.passwordConfirm;

  if (password === confirm) {
    const user = await createUser(req.body);
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
  } else {
    res.status(404).json({
      message: "Not rigth password confirm",
    });
  }
  //   res.send(user);
  //   if (passwod === confirm) {
  //   }
});
