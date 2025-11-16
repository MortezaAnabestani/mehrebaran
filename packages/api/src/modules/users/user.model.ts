import { Schema, model, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserRole } from "common-types";
export { UserRole };
interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

type UserModelType = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    mobile: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, select: false },
    nationalId: { type: String, required: true, unique: true },
    profile: {
      major: String,
      yearOfAdmission: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = model<IUser, UserModelType>("User", userSchema);
