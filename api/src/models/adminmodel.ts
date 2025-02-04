import mongoose from "mongoose";

const AdminAuthSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  profileImage: { type: String, default: null },
  name: { type: String, default: "" },
  password: { type: String, required: true },
});

export const AdminAuthModel = mongoose.model("AdminAuth", AdminAuthSchema);
