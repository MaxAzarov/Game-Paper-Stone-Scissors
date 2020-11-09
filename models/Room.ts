import mongoose, { Schema, Document } from "mongoose";

interface User {
  user: string;
  nickname: string;
}

interface IUserGame {
  user: string;
  nickname: string;
  choice: number;
}

export interface IRoom extends Document {
  users: User[];
  name: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  usersGame: IUserGame[];
}

const RoomSchema = new Schema(
  {
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        nickname: {
          type: String,
          ref: "User",
        },
      },
    ],
    usersGame: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        nickname: {
          type: String,
          ref: "User",
        },
        choice: {
          type: Number,
          validate: {
            validator: function (value: number) {
              return value <= 2 && value >= 0 && Number.isInteger;
            },
            message: "{VALUE} is not an integer value or is not 0,1,2",
          },
        },
      },
    ],
    name: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password: string) {
          return password.length > 2;
        },
        message: (props) => `${props.value} has less than 2 symbols!`,
      },
    },
  },
  { timestamps: true }
);

const Room = mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
