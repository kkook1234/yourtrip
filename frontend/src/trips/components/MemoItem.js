import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";

import Card from "../../shared/UIElements/Card";
import Modal from "../../shared/UIElements/Modal";
import Map from "../../shared/UIElements/Map";
import Backdrop from "../../shared/UIElements/Backdrop";
import "./MemoItem.css";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Editurl = (props) => {
  const tripid = useParams().tripId;
  const day = useParams().day;
  const id = props.id;

  return `/${tripid}/memos/${day}/${id}/editmemo`;
};

const MemoItem = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const tripid = useParams().tripId;
  const day = useParams().day;
  const id = props.id;

  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.REACT_APP_ASSET_URL}${props.img.replace(
      /\\/g,
      "/"
    )})`,
  };
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const openMap = () => setShowMap(true);
  const closeMap = () => setShowMap(false);
  const openDelete = () => setShowDelete(true);
  const closeDelete = () => setShowDelete(false);

  const [newtrip, setnewtrip] = useState(false);

  const memodelete = async () => {
    try {
      const respopnseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${tripid}/${day}/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      setnewtrip(true);
      window.location.reload();
    } catch (err) {}
  };
  return (
    <React.Fragment>
      {showMap && <Backdrop onClick={closeMap} />}
      <Modal className="modal" show={showMap}>
        <div className="modal-location">{props.location}</div>
        <div className="modal-map">
          <Map center={props.coordinates} zoom={16} />
        </div>
        <div className="modal-cancel">
          <button onClick={closeMap}>닫기</button>
        </div>
      </Modal>
      {showDelete && <Backdrop onClick={closeDelete} />}
      <Modal className="modal" show={showDelete}>
        <div className="modal-question-delete">기록을 삭제하시겠습니까?</div>
        <div className="modal-cancel">
          <button onClick={memodelete}>예</button>
          <button onClick={closeDelete}>아니요</button>
        </div>
      </Modal>
      <div className="cover">
        <div className="memo-img" style={backgroundImageStyle} />
        <Card className={"memo-card  "}>
          <p className="memo-location">{props.location}</p>
          <div className="center">
            <p className="memo-description">{props.description}</p>
          </div>
          <span />
          <div className="cover2">
            <div className="memo-location-btn center" onClick={openMap}>
              지도에서 위치 보기
            </div>
            {auth.userId === props.userid && (
              <>
                <div className="center">
                  <Link className="nodeco" to={Editurl(props)}>
                    <div className="memo-edit-btn ">수정</div>
                  </Link>
                </div>
                <div className="memo-delete-btn center" onClick={openDelete}>
                  삭제
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default MemoItem;
