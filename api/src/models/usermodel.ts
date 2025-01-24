import { model, Schema } from "mongoose";

interface User {
  name: string;
  mobile: string;
  address: string;
  active: boolean;
  email: string;
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: [true, "Please enter mobile number"],
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      required: [true, "Please enter Email"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
