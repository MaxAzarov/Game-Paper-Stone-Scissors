import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../db";

interface UserRegister {
  email: string;
  nickname: string;
  password: string;
}

interface IUser {
  user_id: any;
  email: string;
  nickname: string;
  user_password: string;
  wins: number;
  defeat: number;
  draw: number;
}

const resolvers = {
  Query: {
    UserLogin: async function (
      _: any,
      {
        data,
        password,
      }: {
        data: string;
        password: string;
      }
    ) {
      const candidateEmail: {
        rows: IUser[];
      } = await pool.query(`select * from user_account where email = $1`, [
        data,
      ]);

      if (candidateEmail) {
        const match: boolean = await bcrypt.compare(
          password,
          candidateEmail.rows[0].user_password
        );
        if (match) {
          const token: string = await jwt.sign(
            { id: candidateEmail.rows[0].user_id },
            "secretkey",
            {
              expiresIn: "1h",
            }
          );
          return {
            token,
            id: candidateEmail.rows[0].user_id,
            nickname: candidateEmail.rows[0].nickname,
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
        const candidateNickName: {
          rows: IUser[];
        } = await pool.query(`select * from user_account where nickname = $1`, [
          data,
        ]);

        if (candidateNickName) {
          const token = await jwt.sign(
            { id: candidateNickName.rows[0].user_id, nick: data },
            "secretkey",
            {
              expiresIn: "1h",
            }
          );
          return {
            token,
            id: candidateNickName.rows[0].user_id,
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
      const user: {
        rows: IUser[];
      } = await pool.query(`select * from user_account where email = $1`, [
        email,
      ]);
      if (!user.rows) {
        return {
          errors: ["This email is occupied!", "Try another email to register!"],
        };
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await pool.query(
          `insert into user_account(email,nickname,user_password) values($1,$2,$3) returning * `,
          [email, nickname, hashedPassword]
        );
        return {
          status: "ok",
        };
      }
    },
  },
};

export default resolvers;
