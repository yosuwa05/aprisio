import { model, Schema } from "mongoose";

interface User {
  name: string;
  mobile: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  active: boolean;
  email: string;
  password: string;
  image: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  fcmToken: string;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiry: Date | null;
  passwordResetToken: string | null;
  lastEmailSentTime: Date | null

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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: null
    },
    dateOfBirth: {
      type: String,
    },
    fcmToken: {
      type: String,
      default: "",
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
      type: String,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },
    lastEmailSentTime: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please enter Email"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
  },
  { timestamps: true },
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
