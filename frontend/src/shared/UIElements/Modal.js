import React from "react";
import { CSSTransition } from "react-transition-group";

import "./Modal.css";
import Card from "./Card";

const Modal = (props) => {
  return (
    <React.Fragment>
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <Card className={`modal ${props.className}`}>{props.children}</Card>
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
