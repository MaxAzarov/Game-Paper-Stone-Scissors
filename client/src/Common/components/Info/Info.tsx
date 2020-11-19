import React, { useState } from "react";
import "./Info.scss";

const Info = () => {
  const [show, setShow] = useState(false);

  const handleClick = () => {
    setShow(true);
    document.addEventListener("click", closeMenu);
  };

  const closeMenu = () => {
    setShow(false);
    document.removeEventListener("click", closeMenu);
  };
  return (
    <div className="game-info">
      <div className="game-info__wrapper">
        <img src={require("./infoico.png")} alt="" onClick={handleClick} />
        {show && (
          <div className="info">
            A player who decides to play rock will beat another player who has
            chosen scissors ("rock crushes scissors" or sometimes "blunts
            scissors"), but will lose to one who has played paper ("paper covers
            rock"); a play of paper will lose to a play of scissors ("scissors
            cuts paper").
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
