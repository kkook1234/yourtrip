import React from "react";
import "./Sidemodal.css";
import NavLinks from "./NavLinks";
import { CSSTransition } from "react-transition-group";
import ReactDOM from "react-dom";

const Sidemodal = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={300}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="center sidemodal">
        <nav>
          <div className="sidemodal-links" onClick={props.onClick}>
            <NavLinks />
          </div>
        </nav>
      </aside>
    </CSSTransition>
  );
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default Sidemodal;
