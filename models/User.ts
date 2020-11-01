import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  nickname: string;
  password: string;
  wins: number;
  defeat: number;
  draw: number;
  percentOfWin: number;
}

const UserSchema = new Schema({
  email: {
    type: String!,
    required: true,
  },
  nickname: {
    type: String!,
    required: true,
  },
  password: {
    type: String!,
    required: true,
  },
  wins: {
    type: Number,
    default: 0,
    validate: {
      validator: function (wins: number) {
        return wins >= 0;
      },
      message: (props) => `${props.value} is not a positive number!`,
    },
  },
  draw: {
    type: Number,
    default: 0,
    validate: {
      validator: function (draw: number) {
        return draw >= 0;
      },
      message: (props) => `${props.value} is not a positive number!`,
    },
  },
  percentOfWin: {
    type: Number,
    default: 0,
    validate: {
      validator: function (draw: number) {
        return draw >= 0;
      },
      message: (props) => `${props.value} is not a positive number!`,
    },
  },
  defeat: {
    type: Number,
    default: 0,
    validate: {
      validator: function (defeat: number) {
        return defeat >= 0;
      },
      message: (props) => `${props.value} is not a positive number!`,
    },
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
