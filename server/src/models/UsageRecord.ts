import { Schema, model, Document } from "mongoose";

const feature = {
  letter: "letter", 
  style: "style",
  chat: "chat",
}
interface IUsageRecord {
  userId: string;
  featureKey: keyof typeof feature; 
  usedAt: Date;
}

const usageRecordSchema = new Schema<IUsageRecord>({
  userId: { type: String, required: true },
  featureKey: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
});

const UsageRecord = model<IUsageRecord>("UsageRecord", usageRecordSchema);

export { UsageRecord, IUsageRecord, feature };

