import { IUser } from "./../../../../types/rootTypes";
import { USER_LOGIN } from "../actionTypes/user";

const initialState: IUser = {
  token: "",
  id: "",
  nickname: "",
};

const user = (state = initialState, action: any) => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        id: action.id,
        token: action.token,
        nickname: action.nickname,
      };
    default:
      return {
        ...state,
      };
  }
};
export default user;
