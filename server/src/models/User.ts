import { Schema, model, Document } from "mongoose";

const PLAN = {
  FREE: "Free",
  PRO: "Pro",
  ENTERPRISE: "Enterprise",
};
interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  plan: string;
  letterTrials?: number;
  styleTrials?: number;
  chatTrials?: number;
  metadata: {
    isVerified?: boolean;
    lastLogin?: Date;
    subscriptionData?: {
      plan: string;
      status: string;
      startDate: Date;
      endDate?: Date;
    };
    createdAt?: Date;
  };

}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  letterTrials: { type: Number, default: 3 },
  styleTrials: { type: Number, default: 3 },
  chatTrials: { type: Number, default: 3 },
  metadata: {
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    subscriptionData: {
      plan: { type: String, enum: Object.values(PLAN), default: PLAN.FREE },
      status: { type: String, enum: ["active", "paused", "canceled"], default: "active" },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date },
    },
    createdAt: { type: Date, default: Date.now },
  },
});

const User = model<IUser>("User", userSchema);

export { User, IUser, PLAN };
