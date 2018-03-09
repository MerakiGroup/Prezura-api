import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    cognitoId: String
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
