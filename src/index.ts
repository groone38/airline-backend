import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import { productsRoute } from "./routers/products-router";
import { addressesRoute } from "./routers/addresses-router";
import { notesRouter } from "./routers/notes-router";
import { usersRouter } from "./routers/users-router";
import { componyRouter } from "./routers/compony-router";
import { authRouter } from "./routers/auth-router";

const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const parserMiddleware = bodyParser({});
app.use(parserMiddleware);
app.use(cors());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/compony", componyRouter);
app.use("/notes", notesRouter);
app.use("/products", productsRoute);
app.use("/addresses", addressesRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
