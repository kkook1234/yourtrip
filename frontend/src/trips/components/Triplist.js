import React from "react";

import "./Triplist.css";
import TripItem from "./TripItem";

const lists = [
  {
    id: 1,
    userid: 1,
    nickname: "kkook1234",
    title: "나홀로 제주도 여행기",
    img: "img/trip.jpeg",
  },
  {
    id: 2,
    userid: 2,
    nickname: "nickname",
    title: "경복궁 구경왔어요!",
    img: "img/경복궁.jpg",
  },
];

const Triplist = (props) => {
  return (
    <div className="center">
      <ul className="triplist">
        {props.items.length == 0 && (
          <p className="trip-none">여행 기록이 없습니다.</p>
        )}
        {props.items.map((props) => (
          <TripItem
            key={props.id}
            id={props.id}
            creatorid={props.creator.id}
            nickname={props.creator.nickname}
            title={props.title}
            img={props.image}
          />
        ))}
      </ul>
    </div>
  );
};

export default Triplist;
