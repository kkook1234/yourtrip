import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import Loadingspinner from "../../shared/UIElements/Loadingspinner";
import { useNavigate } from "react-router-dom";
import Menubox from "../../shared/UIElements/Menubox";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Editmemo.css";

const Editmemo = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const tripid = useParams().tripId;
  const day = useParams().day;
  const memoid = useParams().memoid;

  const navigate = useNavigate(); // useNavigate hook을 이 컴포넌트 내에서 사용

  const auth = useContext(AuthContext);
  const [existingdata, setExistingdata] = useState();
  const [editmemo, seteditmemo] = useState(false);
  const [validatecheck, setValidatecheck] = useState({});
  const [imgsrc, setImgSrc] = useState();
  const [existinglocation, setExistinglocation] = useState();
  const [existingdescription, setExistingdescription] = useState();
  const [inputdata, setInputdata] = useState({});

  useEffect(() => {
    const fetchTrips = async (event) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}/${day}/${memoid}`
        );
        setExistingdata(responseData);
      } catch (err) {}
    };
    fetchTrips();
  }, [sendRequest]);

  useEffect(() => {
    if (existingdata) {
      setInputdata({
        location: `${existingdata.memo[0].location}`,
        description: `${existingdata.memo[0].description}`,
      });
      setImgSrc(existingdata.memo[0].img);
      setExistinglocation(existingdata.memo[0].location);
      setExistingdescription(existingdata.memo[0].description);
    }
  }, [existingdata]);

  const contents = [
    {
      title: "대표 이미지",
      type: "image",
      existing: imgsrc,
    },
    {
      title: "위치",
      id: "location",
      type: "input",
      existing: existinglocation,
      validate: [VALIDATOR_REQUIRE()],
    },
    {
      title: "내용",
      id: "description",
      type: "text",
      existing: existingdescription,
      className: "description",
      validate: [VALIDATOR_REQUIRE()],
    },
    {
      title: "수정하기",
      type: "button",
      to: "/",
      className: "loginbtn",
      formtype: true,
    },
  ];

  const SubmitHandler = async (event) => {
    event.preventDefault();

    const formdata = new FormData();
    formdata.append("location", inputdata.location);
    formdata.append("description", inputdata.description);
    formdata.append("img", inputdata.image);
    try {
      const respopnseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}/${day}/${memoid}`,
        "PATCH",
        formdata,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      seteditmemo(true);
    } catch (err) {}
  };
  useEffect(() => {
    if (editmemo) {
      navigate(`/${tripid}/memos/${day}`);
    }
  }, [editmemo]);

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
            menu={"기록 수정"}
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

export default Editmemo;
