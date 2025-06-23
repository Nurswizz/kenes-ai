import { Schema, model, Document } from "mongoose";

const PLAN = {
  FREE: "free",
  PRO: "pro",
  ENTERPRISE: "enterprise",
};
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  memberstackId?: string;
  plan: string;
  letterTrials?: number;
  styleTrials?: number;
  chatTrials?: number;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  memberstackId: { type: String, unique: true },
  plan: { type: String, default: PLAN.FREE, enum: Object.values(PLAN) },
  letterTrials: { type: Number, default: 3 },
  styleTrials: { type: Number, default: 3 },
  chatTrials: { type: Number, default: 3 },
});

const User = model<IUser>("User", userSchema);

export { User, IUser, PLAN };
