import { Schema, model } from "mongoose";
import { ISetting } from "common-types";

const settingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SettingModel = model<ISetting>("Setting", settingSchema);
