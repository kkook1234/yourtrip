import React from "react";

import "./Guidebox.css";

const Guidebox = (props) => {
  return (
    <div className="center">
      <div className="guidebox center">{props.text}</div>
    </div>
  );
};

export default Guidebox;
