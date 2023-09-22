import React from "react";
import { ReactDOM } from "react";
import Modal from "./Modal";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";
import "./ErrorModal.css";

const ErrorModal = (props) => {
  return (
    <React.Fragment>
      {props.error && <Backdrop onClick={props.onClear} />}
      <Modal className={"error-modal"} show={!!props.error}>
        <div className="modal-question-delete">{props.error}</div>
      </Modal>
    </React.Fragment>
  );
};

export default ErrorModal;
