import { Schema, model, models, Document } from "mongoose";
import { RewardTokenDistribution } from "Types/token";

export interface ISnapshot extends Document {
  snapshot: number;
  timestamp: number;
  data: RewardTokenDistribution[];
}

const snapshotSchema = new Schema<ISnapshot>({
  snapshot: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  data: { type: [Object], required: true },
});

export const SnapshotModel = models.Snapshot || model<ISnapshot>("Snapshot", snapshotSchema);
