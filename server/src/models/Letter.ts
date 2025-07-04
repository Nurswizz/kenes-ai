import { Schema, model } from "mongoose";

interface ILetter {
  id: string;
  userId: string;
  pdf_url: string;
}

const letterSchema = new Schema<ILetter>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  pdf_url: { type: String, required: true },
});

const Letter = model<ILetter>("Letter", letterSchema);

export { ILetter, letterSchema, Letter };
