import { Schema, model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  dateCreated: Date;
  id: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const User = model<IUser>("user", UserSchema);
export default User;
