import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import Loadingspinner from "../../shared/UIElements/Loadingspinner";
import { useNavigate, useParams } from "react-router-dom";
import Menubox from "../../shared/UIElements/Menubox";

import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Newtrip.css";

const EditTrip = () => {
  const tripId = useParams().tripId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate(); // useNavigate hook을 이 컴포넌트 내에서 사용
  const [inputdata, setInputdata] = useState({});
  const auth = useContext(AuthContext);
  const [newtrip, setnewtrip] = useState(false);
  const [validatecheck, setValidatecheck] = useState({});

  const [existingdata, setExistingdata] = useState();
  const [imgsrc, setImgSrc] = useState();
  const [existingtitle, setExistingtitle] = useState();
  useEffect(() => {
    const fetchTrips = async (event) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/trips/${tripId}`
        );
        setExistingdata(responseData);
      } catch (err) {}
    };
    fetchTrips();
  }, [sendRequest]);
  useEffect(() => {
    if (existingdata) {
      setInputdata({
        title: `${existingdata.trip.title}`,
      });
      setImgSrc(existingdata.trip.image);
      setExistingtitle(existingdata.trip.title);
    }
  }, [existingdata]);
  const contents = [
    {
      title: "제목",
      id: "title",
      type: "input",
      existing: existingtitle,
      validate: [VALIDATOR_REQUIRE()],
    },
    {
      title: "대표 이미지",
      type: "image",
      existing: imgsrc,
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
    formdata.append("title", inputdata.title);
    formdata.append("creator", auth.userId);
    formdata.append("image", inputdata.image);

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripId}`,
        "PATCH",
        formdata,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      setnewtrip(true);
    } catch (err) {}
  };
  useEffect(() => {
    if (newtrip) {
      navigate("/");
    }
  }, [newtrip]);

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
            menu={"여행 수정"}
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

export default EditTrip;
