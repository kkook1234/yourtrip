import React, { useState, useEffect, useContext } from "react";

import ErrorModal from "../../shared/UIElements/ErrorModal";
import Loadingspinner from "../../shared/UIElements/Loadingspinner";
import Triplist from "../components/Triplist";
import "./Mytrips.css";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Mytrips = () => {
  const { isLoading, error, sendRequest, clearError, setIsLoading } =
    useHttpClient();
  const auth = useContext(AuthContext);

  const [loadedTrips, setLoadedTrips] = useState();

  useEffect(() => {
    const fetchTrips = async (event) => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/trips/user/${auth.userId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );

        setLoadedTrips(responseData.trip);
      } catch (err) {}
    };
    fetchTrips();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onclear={clearError} />
      {isLoading && <Loadingspinner />}
      {!isLoading && loadedTrips && (
        <div className="center">
          <div>
            <div className="menubox-menu">내기록</div>
            <div className="center">
              <span className="mytrips-span" />
            </div>
            <Triplist items={loadedTrips} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Mytrips;
