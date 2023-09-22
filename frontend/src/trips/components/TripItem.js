import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Backdrop from "../../shared/UIElements/Backdrop";
import Modal from "../../shared/UIElements/Modal";
import "./TripItem.css";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const TripItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.REACT_APP_ASSET_URL}${props.img.replace(
      /\\/g,
      "/"
    )})`,
  };
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  const openDelete = () => setShowDelete(true);
  const closeDelete = () => setShowDelete(false);

  const tripid = useParams().tripId;

  const deletetrip = async () => {
    try {
      const respopnseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/trips/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      closeDelete();
      window.location.reload();
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {showDelete && <Backdrop onClick={closeDelete} />}
      <Modal className="modal" show={showDelete}>
        <div className="modal-question-delete">
          여행 기록을 삭제하시겠습니까?
        </div>
        <div className="modal-cancel">
          <button onClick={deletetrip}>예</button>
          <button onClick={closeDelete}>아니요</button>
        </div>
      </Modal>
      <Link to={`/${props.id}/memos/1`}>
        <li className="tripitem" style={backgroundImageStyle}>
          {auth.userId === props.creatorid && (
            <>
              <div
                className="tripitem-update nodeco"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${props.id}/edittrip`);
                }}
              >
                수정
              </div>
              <div
                className="tripitem-delete"
                onClick={(e) => {
                  e.preventDefault();
                  openDelete(e);
                }}
              >
                삭제
              </div>
            </>
          )}

          <div className="tripitem-nickname">{props.nickname}</div>
          <div className="tripitem-title">{props.title}</div>
        </li>
      </Link>
    </React.Fragment>
  );
};

export default TripItem;
