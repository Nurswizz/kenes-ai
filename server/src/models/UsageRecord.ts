import { Schema, model, Document } from "mongoose";

interface IUsageRecord {
  userId: string;
  featureKey: string;
  usedAt: Date;
}

const usageRecordSchema = new Schema<IUsageRecord>({
  userId: { type: String, required: true },
  featureKey: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
});

const UsageRecord = model<IUsageRecord>("UsageRecord", usageRecordSchema);

export { UsageRecord, IUsageRecord };

