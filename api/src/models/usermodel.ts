import { model, Schema } from "mongoose";

interface User {
  name: string;
  mobile: string;
  address: string;
  active: boolean;
  email: string;
  password: string;
  image: string
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
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String
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

UserSchema.pre("save", async function (next) {
  const admin = this;

  if (!admin.isModified("password")) {
    return next();
  }

  admin.password = await Bun.password.hash(admin.password);

  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return await Bun.password.verify(password, this.password);
};

export const UserModel = model<User>("User", UserSchema);
