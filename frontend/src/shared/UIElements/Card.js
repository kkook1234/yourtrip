import React from "react";

import "./Card.css";

const Card = (props) => {
  return (
    // <div className="center">
    <div className={`card ${props.className}`}>{props.children}</div>
    // </div>
  );
};

export default Card;
