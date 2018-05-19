import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    data: [
      {
        value: Number,
        x: Number,
        y: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("PressureData", dataSchema);

// [
//   { value: 0, x: 120, y: 40 },
//   { value: 0, x: 40, y: 100 },
//   { value: 0, x: 100, y: 90 },
//   { value: 0, x: 70, y: 105 },
//   { value: 0, x: 80, y: 230 }
// ];
