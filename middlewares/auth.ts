import jwt from "jsonwebtoken";

const TokenDecode = async (token: string): Promise<any> => {
  if (token) {
    token = token.replace("Bearer ", "");
  }
  let decodedToken;
  try {
    decodedToken = await jwt.verify(token, "secretkey");
    console.log("decodedToken:", decodedToken);
  } catch (err) {
    return {
      errors: ["Please login again!"],
    };
  }
  return decodedToken;
};

export default TokenDecode;
