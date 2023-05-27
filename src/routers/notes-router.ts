import { Request, Response, Router } from "express";
import { createNote, getNote, getNotes } from "../database";

export const notesRouter = Router();

notesRouter.get("/", async (req: Request, res: Response) => {
  const notes = await getNotes();
  res.send(notes);
});

notesRouter.get("/:id", async (req: Request, res: Response) => {
  const note = await getNote(req.params.id);
  res.send(note);
});

notesRouter.post("/", async (req: Request, res: Response) => {
  const note = await createNote(req.body.title, req.body.contents);
  res.send(note);
});
