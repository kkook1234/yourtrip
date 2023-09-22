import React, { useEffect } from "react";

import { useParams } from "react-router-dom";

import "./Memolist.css";
import Guidebox from "../../shared/UIElements/Guidebox";
import MemoItem from "./MemoItem";

const Memolist = (props) => {
  const trip = props.trip;
  const day = props.day;

  return (
    <React.Fragment>
      <div className="memo-title">
        <p>{trip.title}</p>
      </div>
      <div className="memo-creator">
        <p>{trip.creator.nickname}</p>
      </div>
      <Guidebox text={`DAY ${day}`} />
      {trip.memo[day - 1].length == 0 && (
        <p className="trip-none">여행 기록이 없습니다.</p>
      )}
      {trip.memo[day - 1].map((props) => (
        <MemoItem
          key={`${props.day}-${props.id}`}
          id={props.id}
          userid={trip.creator.id}
          img={props.img}
          location={props.location}
          description={props.description}
          coordinates={props.coordinates}
        />
      ))}
    </React.Fragment>
  );
};

export default Memolist;
