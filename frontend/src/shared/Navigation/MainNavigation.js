import React, { useState } from "react";
import { Link } from "react-router-dom";

import NavLinks from "./NavLinks";
import Sidemodal from "./Sidemodal";
import "./MainNavigation.css";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = () => {
  const [modal, setModal] = useState(false);
  const modalOpen = () => {
    setModal(true);
  };
  const modalClose = () => {
    setModal(false);
  };

  return (
    <React.Fragment>
      {modal && <Backdrop onClick={modalClose} />}
      <Sidemodal show={modal} onClick={modalClose}></Sidemodal>

      <header className="main-header">
        <button className="main-navigation__menu-btn" onClick={modalOpen}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <a href="/">YourTrip</a>
        </h1>
        <nav className="main-navigation__nav-link">
          <ul className="nav-links">
            <NavLinks />
          </ul>
        </nav>
      </header>
    </React.Fragment>
  );
};

export default MainNavigation;
