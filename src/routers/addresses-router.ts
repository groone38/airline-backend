import { Request, Response, Router } from "express";

export const addressesRoute = Router();

const addresses = [
  { id: 1, value: "Vologodskay 19" },
  { id: 2, value: "Gidrostroy 28" },
];

addressesRoute.get("/", (req: Request, res: Response) => {
  res.send(addresses);
});

addressesRoute.get("/:id", (req: Request, res: Response) => {
  let address = addresses.find((item) => item.id === +req.params.id);
  if (address) {
    res.send(address);
  } else {
    res.send(404);
  }
  res.send(addresses);
});
