import React from "react";

import "./Loadingspinner.css";

const Loadingspinner = (props) => {
  return (
    <div className={`${props.asOverlay && "loading-spinner__overlay"} center`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};

export default Loadingspinner;
