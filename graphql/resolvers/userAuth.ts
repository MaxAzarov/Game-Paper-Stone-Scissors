import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { IUser } from "./../../models/User";
import UserAuth from "./../../services/UserAuth";

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
      const candidateEmail: IUser | null = await UserAuth.findUserByEmail(data);
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
        return {
          errors: [
            "Password don't match with this email/nickname",
            "Enter correct password",
          ],
        };
      }
    },
  },
  Mutation: {
    UserRegister: async function (
      _: any,
      { email, nickname, password }: UserRegister
    ) {
      const user: IUser | null = await UserAuth.findUserByEmail(email);

      if (user) {
        return {
          errors: ["This email is occupied!", "Try another email to register!"],
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        UserAuth.createNewUser({
          email,
          nickname,
          password: hashedPassword,
        });

        return {
          status: "ok",
        };
      }
    },
  },
};

export default resolvers;
