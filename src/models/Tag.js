import { Schema, model } from "mongoose";
import timezone from 'mongoose-timezone'

const tagSchema = new Schema(
  {
    tag: String,
    s: [
        {
            rssi: Number,
            wap: String
        }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

tagSchema.plugin(timezone)
export default model("Tag", tagSchema);
