import React from "react";
import "./Error.scss";

interface IProps {
  error: string;
}

const Error = ({ error }: IProps) => {
  return <p className="error-message">{error}</p>;
};
export default Error;
