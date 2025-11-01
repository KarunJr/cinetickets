import { models, model, Schema, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";


export enum Role{
  User = "user",
  Admin = "admin"
}

export interface userI extends Document {
  name: string;
  email: string;
  password?: string;
  image: string;
  role: Role;
  provider: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<userI>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User

    },
    provider: {
      type: String,
      required: true,
      default: "credentials",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (this: userI, next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User: Model<userI> = models?.User || model<userI>("User", userSchema);

export default User;
