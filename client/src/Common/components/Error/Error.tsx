import React from "react";

import "./Error.scss";

interface IProps {
  error: string;
}

const Error = ({ error }: IProps) => {
  // localStorage.removeItem("token");
  // localStorage.removeItem("id");
  // localStorage.removeItem("nickname");
  return <p className="error-message">{error}</p>;
};
export default Error;
