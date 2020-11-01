import { USER_LOGIN, ISetUserInfo } from "../actionTypes/user";
export const SetUserLogin = (
  token: string,
  id: string,
  nickname: string
): ISetUserInfo => ({
  type: USER_LOGIN,
  token,
  id,
  nickname,
});
