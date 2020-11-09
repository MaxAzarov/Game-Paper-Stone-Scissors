import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User, { IUser } from "./../../models/User";

interface UserRegister {
  email: string;
  nickname: string;
  password: string;
}
interface UserLogin {
  data: string;
  password: string;
}
const resolvers = {
  Query: {
    UserLogin: async function (_: any, { data, password }: UserLogin) {
      // email
      const candidateEmail: IUser | null = await User.findOne({ email: data });
      if (candidateEmail) {
        const match: boolean = await bcrypt.compare(
          password,
          candidateEmail.password
        );
        if (match) {
          const token: string = await jwt.sign(
            { id: candidateEmail._id },
            "secretkey",
            {
              expiresIn: "1h",
            }
          );
          return {
            token,
            id: candidateEmail._id,
            nickname: candidateEmail.nickname,
          };
        } else {
          return {
            errors: [
              "Password don't match with this email/nickname",
              "Enter correct password",
            ],
          };
        }
      } else {
        const candidateNickName: IUser | null = await User.findOne({
          nickname: data,
        });
        if (candidateNickName) {
          const token = await jwt.sign(
            { id: candidateNickName._id, nick: data },
            "secretkey",
            {
              expiresIn: "1h",
            }
          );
          return {
            token,
            id: candidateNickName._id,
          };
        } else {
          return {
            errors: [
              "There isn't user with this email or nickname!",
              "Please enter correct email or nickname!",
            ],
          };
        }
      }
    },
  },
  Mutation: {
    UserRegister: async function (
      _: any,
      { email, nickname, password }: UserRegister
    ) {
      const user = await User.findOne({ email });
      if (user) {
        return {
          errors: ["This email is occupied!", "Try another email to register!"],
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, nickname, password: hashedPassword });
        await newUser.save();
        return {
          status: "ok",
        };
      }
    },
  },
};

export default resolvers;
