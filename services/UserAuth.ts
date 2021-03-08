import User, { IUser } from "../models/User";

interface UserRegister {
  email: string;
  nickname: string;
  password: string;
}

interface IUserAuth {
  findUserByEmail(email: string): Promise<IUser | null>;
  createNewUser(user: UserRegister): Promise<IUser>;
}

class UserAuth implements IUserAuth {
  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
  }

  async createNewUser(user: UserRegister): Promise<IUser> {
    const newUser = new User(user);
    await newUser.save();
    return newUser;
  }
  async findUserById(id: string) {
    const user = await User.findOne({ _id: id });
    return user;
  }
}

export default new UserAuth();
