import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import Loadingspinner from "../../shared/UIElements/Loadingspinner";
import { useNavigate } from "react-router-dom";

import Menubox from "../../shared/UIElements/Menubox";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Addmemo.css";
const contents = [
  {
    title: "대표 이미지",
    type: "image",
  },
  {
    title: "위치",
    id: "location",
    type: "input",
    validate: [VALIDATOR_REQUIRE()],
  },
  {
    title: "내용",
    id: "description",
    type: "text",
    className: "description",
    validate: [VALIDATOR_REQUIRE()],
  },
  {
    title: "추가하기",
    type: "button",
    to: "/",
    className: "loginbtn",
    formtype: true,
  },
];
const Addmemo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const tripid = useParams().tripId;
  const day = useParams().day;
  const navigate = useNavigate(); // useNavigate hook을 이 컴포넌트 내에서 사용
  const [inputdata, setInputdata] = useState({});
  const auth = useContext(AuthContext);

  const [addmemo, setaddmemo] = useState(false);
  const [validatecheck, setValidatecheck] = useState({
    location: true,
    description: true,
    image: true,
  });
  const SubmitHandler = async (event) => {
    event.preventDefault();

    const formdata = new FormData();
    formdata.append("location", inputdata.location);
    formdata.append("description", inputdata.description);
    formdata.append("img", inputdata.image);

    try {
      const respopnseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}/${day}`,
        "POST",
        formdata,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      setaddmemo(true);
    } catch (err) {}
  };

  useEffect(() => {
    if (addmemo) {
      navigate(`/${tripid}/memos/${day}`);
    }
  }, [addmemo]);

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
            className="create"
            menu={"기록 추가"}
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

export default Addmemo;
