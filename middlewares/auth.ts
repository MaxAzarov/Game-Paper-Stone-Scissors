import jwt from "jsonwebtoken";

const TokenDecode = async (token: string) => {
  if (token) {
    token = token.replace("Bearer ", "");
  }
  // console.log("token without bearer", token);
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, "secretkey");
  } catch (err) {
    return {
      errors: ["Please login again!"],
    };
  }
  if (!decodedToken) {
    return {
      errors: ["Please login again!"],
    };
  }
  return decodedToken;
};

export default TokenDecode;
