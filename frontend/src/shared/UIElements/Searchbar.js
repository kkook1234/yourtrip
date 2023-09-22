import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./Searchbar.css";

const Searchbar = (props) => {
  const [inputdata, setInputdata] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/trips/search`,
        "POST",
        JSON.stringify({
          keyword: inputdata,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      props.setdata(responseData.trips);
    } catch (err) {}
  };

  const inputchange = (e) => {
    setInputdata(e.target.value);
  };

  return (
    <div className="center">
      <form onSubmit={SubmitHandler}>
        <div className="searchbar">
          <img
            className="searchbar-img"
            src="img/search.png"
            alt="search"
          ></img>
          <input
            className="searchbar-input"
            type="text"
            placeholder="관심가는 여행지가 있나요?"
            onChange={inputchange}
          />
          <button className="searchbar-btn center" type="submit">
            search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;
