import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

import "./NavLinks.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  return (
    <React.Fragment>
      {auth.isLoggedIn && (
        <>
          <li>
            <NavLink to="/createtrip" className="otherbtn">
              추가하기
            </NavLink>
          </li>
          <li>
            <NavLink to="/mytrips" className="otherbtn">
              내기록
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className="logoutbtn" onClick={auth.logout}>
              로그아웃
            </NavLink>
          </li>
        </>
      )}
      {!auth.isLoggedIn && (
        <>
          <li>
            <NavLink to="/login" className="otherbtn">
              로그인
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className="otherbtn">
              회원가입
            </NavLink>
          </li>
        </>
      )}
    </React.Fragment>
  );
};

export default NavLinks;
