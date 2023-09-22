import React, { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import Menubox from "../../shared/UIElements/Menubox";
import "./Signup.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Loadingspinner from "../../shared/UIElements/Loadingspinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";

const contents = [
  {
    title: "닉네임",
    id: "nickname",
    type: "input",
    rows: 1,
    validate: [VALIDATOR_REQUIRE()],
  },
  {
    title: "이메일",
    id: "email",
    type: "input",
    rows: 1,
    validate: [VALIDATOR_EMAIL()],
  },
  {
    title: "비밀번호",
    id: "password",
    type: "input",
    rows: 1,

    validate: [VALIDATOR_MINLENGTH(6)],
  },
  {
    title: "회원가입",
    type: "button",
    to: "/",
    className: "loginbtn",
    formtype: true,
  },
  {
    title: "로그인하기",
    type: "button",
    to: "/login",
  },
];

const Signup = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const navigate = useNavigate(); // useNavigate hook을 이 컴포넌트 내에서 사용
  const [inputdata, setInputdata] = useState({});
  const auth = useContext(AuthContext);

  const [signup, setSignup] = useState(false);
  const [validatecheck, setValidatecheck] = useState({
    nickname: true,
    email: true,
    password: true,
  });

  const SubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        "POST",
        JSON.stringify({
          nickname: inputdata.nickname,
          email: inputdata.email,
          password: inputdata.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      setSignup(true);
    } catch (err) {}
  };
  useEffect(() => {
    if (signup) {
      navigate("/login");
    }
  }, [signup]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading ? (
        <div className="center">
          <Loadingspinner asOverlay />
        </div>
      ) : (
        <div className="center">
          <Menubox
            className="signup"
            menu={"회원가입"}
            contents={contents}
            onSubmit={SubmitHandler}
            setinput={setInputdata}
            input={inputdata}
            validatecheck={validatecheck}
            setValidatecheck={setValidatecheck}
          ></Menubox>
        </div>
      )}
    </React.Fragment>
  );
};

export default Signup;
