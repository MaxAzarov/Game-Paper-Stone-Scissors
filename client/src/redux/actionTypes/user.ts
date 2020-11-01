export const USER_LOGIN = "USER_LOGIN";

export interface ISetUserInfo {
  type: typeof USER_LOGIN;
  token: string;
  id: string;
  nickname: string;
}
