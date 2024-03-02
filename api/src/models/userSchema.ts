import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";
import validator from "validator";

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends IUser, Document {
  matchPassword(inputPassword: string): Promise<boolean>;
  getSignedToken(): { accessToken: string; refreshToken: string };
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    trim: true,
    required: [true, "Name required"],
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: [true, "Email required"],
    validate: {
      validator: function (value: string) {
        return validator.default.isEmail(value);
      },
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minlength: 8,
  },
});

userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods = {
  matchPassword: function (inputPassword: string) {
    return bcrypt.compare(inputPassword, this.password);
  },

  getSignedToken: function (this: UserDocument) {
    const accessToken = jwt.sign(
      { id: this._id },
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: "30s",
      }
    );
    const refreshToken = jwt.sign(
      { id: this._id },
      process.env.REFRESH_TOKEN_SECRET_KEY as string,
      {
        expiresIn: "2min",
      }
    );
    return { accessToken, refreshToken };
  },
};

export default model<UserDocument>("user", userSchema);
