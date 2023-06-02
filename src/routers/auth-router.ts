import { Request, Response, Router } from "express";
import { authUser, registrUser } from "../database";

export const authRouter = Router();
const jwt = require("jsonwebtoken");

authRouter.post("/registr", async (req: Request, res: Response) => {
  const password = req.body.password;
  const confirm = req.body.confirmPassword;

  if (password === confirm) {
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
  } else {
    res.status(404).json({
      message: "Not rigth password confirm",
    });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const login = await authUser(req.body);
  console.log(login[0]);
  if (login) {
    const token = jwt.sign(login[0].id, process.env.JWT_SECRET);
    res.status(200).json({
      message: "Login sucsses",
      token: token,
      admin: login[0].admin,
    });
  } else {
    res.status(404).json({
      message: "User not found!",
    });
  }
});
