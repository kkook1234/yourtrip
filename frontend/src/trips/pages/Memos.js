import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Memos.css";

import { AuthContext } from "../../shared/context/auth-context";
import Modal from "../../shared/UIElements/Modal";
import Backdrop from "../../shared/UIElements/Backdrop";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import Loadingspinner from "../../shared/UIElements/Loadingspinner";
import Memolist from "../components/Memolist";
import Card from "../../shared/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";

const dummylist = [
  {
    memoid: 1,
    title: "나홀로 제주도 여행기",
    creator: "kkook1234",
    memo: [
      [
        /*day1*/
        {
          /*day1-첫번째 글*/
          day: 1,
          id: 1,
          img: "img/김포공항.jfif",
          location: "김포공항",
          description: "여행 첫날입니다.\n아침 일찍 김포공항에 도착했어요!",
          coordinates: { lat: 37.565933, lng: 126.80088 },
        },
        {
          /*day1-두 번째 글*/
          day: 1,
          id: 2,
          img: "img/유채꽃.jpg",
          location: "제주도 유채꽃밭",
          description: "꽃이 만개해서 사진찍기 좋았어요!",
          coordinates: { lat: 37.565933, lng: 126.80088 },
        },
        {
          /*day2-첫번째 글*/
          day: 2,
          id: 1,
          img: "img/성산일출봉.jfif",
          location: "성산일출봉",
          description: "둘째 날 아침! \n성산일출봉에 올라왔어요!",
          coordinates: { lat: 37.7634, lng: 126.878 },
        },
      ],
      [
        /*day2*/
        {
          /*day2-첫번째 글*/
          day: 2,
          id: 1,
          img: "img/성산일출봉.jfif",
          location: "성산일출봉",
          description: "둘째 날 아침! \n성산일출봉에 올라왔어요!",
          coordinates: { lat: 37.7634, lng: 126.878 },
        },
        {
          /*day2-두 번째 글*/
          day: 2,
          id: 2,
          img: "img/소금빵.jpg",
          location: "소금빵 맛집",
          description: "유명한 소금빵 맛집에 다녀왔는데 정말 맛있었어요!",
          coordinates: { lat: 37.7634, lng: 126.878 },
        },
      ],
      [
        /*day2*/
        {
          /*day2-첫번째 글*/
          day: 3,
          id: 1,
          img: "img/성산일출봉.jfif",
          location: "성산일출봉",
          description: "둘째 날 아침! \n성산일출봉에 올라왔어요!",
          coordinates: { lat: 37.7634, lng: 126.878 },
        },
        {
          /*day2-두 번째 글*/
          day: 3,
          id: 2,
          img: "img/소금빵.jpg",
          location: "소금빵 맛집",
          description: "유명한 소금빵 맛집에 다녀왔는데 정말 맛있었어요!",
          coordinates: { lat: 37.7634, lng: 126.878 },
        },
      ],
    ],
  },
  {
    memoid: 2,
    title: "경복궁 구경왔어요!",
    creator: "nickname",
    memo: [
      /*day1*/ [
        {
          /*day1-첫번째 글*/
          day: 1,
          id: 1,
          img: "img/경복궁.jpg",
          location: "경복궁",
          description: "오랜만에 경복궁 구경왔어요!",
          coordinates: { lat: 37.7634, lng: 126.878 },
        },
      ],
    ],
  },
];

const Memos = () => {
  const auth = useContext(AuthContext);

  const tripid = useParams().tripId;
  const day = useParams().day;
  // const dummylist2 = dummylist.filter((props) => props.memoid == tripid);
  // const memo = dummylist2[0].memo.filter(([props]) => props.day == day);
  // const userid = useParams().userId;
  const dayplus = parseInt(useParams().day) + 1;
  const dayminus = parseInt(useParams().day) - 1;

  const [login, setLogin] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const openDelete = () => setShowDelete(true);
  const closeDelete = () => setShowDelete(false);

  const [loadedTrip, setLoadedTrip] = useState();
  const navigate = useNavigate();

  const { isLoading, error, sendRequest, clearError, setIsLoading } =
    useHttpClient();

  const fetchTrips = async (event) => {
    setIsLoading(true);
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}`
      );

      setLoadedTrip(responseData.trip);
    } catch (err) {}
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const plusday = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}`,
        "POST",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      setLogin(true);
      fetchTrips();
      navigate(`/${tripid}/memos/${dayplus}`);
    } catch (err) {}
  };
  const daydelete = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}/${day}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      fetchTrips();
      closeDelete();
      navigate(`/${tripid}/memos/${day - 1}`);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onclear={clearError} />
      {isLoading && <Loadingspinner />}
      {!isLoading && loadedTrip && (
        <div className="memo-flex">
          {showDelete && <Backdrop onClick={closeDelete} />}
          <Modal className="modal" show={showDelete}>
            <div className="modal-question-delete">
              DAY{day}부터의 기록을 삭제하시겠습니까?
            </div>
            <div className="modal-cancel">
              <button onClick={daydelete}>예</button>
              <button onClick={closeDelete}>아니요</button>
            </div>
          </Modal>

          {parseInt(dayminus) > 0 && ( //페이지에 맞게 방향 모양 출력
            <>
              {auth.userId === loadedTrip.creator.id && (
                <div className="day-delete-btn center" onClick={openDelete}>
                  DAY 삭제
                </div>
              )}
              <Link to={`/${tripid}/memos/${dayminus}`}>
                <img className="left" src="../../../../img/left.png"></img>
              </Link>
            </>
          )}
          <div className="memos">
            {loadedTrip.memo.length != 0 && (
              <Memolist trip={loadedTrip} day={day} />
            )}
            {auth.userId === loadedTrip.creator.id && (
              <Link to={`/${tripid}/memos/${day}/addmemo`}>
                <Card className={"memo-plus-btn"}>
                  <img src="../../../../img/plus.png"></img>
                </Card>
              </Link>
            )}
          </div>
          {parseInt(dayplus) <= parseInt(loadedTrip.memo.length) && ( //페이지에 맞게 방향 모양 출력
            <Link to={`/${tripid}/memos/${dayplus}`}>
              <img
                className="right"
                src="../../../../img/right.png"
                alt={"기록 추가하기"}
              ></img>
            </Link>
          )}
          {parseInt(dayplus) > parseInt(loadedTrip.memo.length) &&
            auth.userId === loadedTrip.creator.id && ( //페이지에 맞게 방향 모양 출력
              <img
                className="dayplus"
                src="../../../../img/dayplus.png"
                alt={"날짜 추가하기"}
                onClick={plusday}
              ></img>
            )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Memos;
