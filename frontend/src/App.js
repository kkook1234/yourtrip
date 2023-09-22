import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainNavigation from "./shared/Navigation/MainNavigation";
// import Trips from "./trips/pages/Trips";
// import Memos from "./trips/pages/Memos";
// import Login from "./user/pages/Login";
// import Signup from "./user/pages/Signup";
// import Newtrip from "./trips/pages/Newtrip";
// import Addmemo from "./trips/pages/Addmemo";
// import Editmemo from "./trips/pages/Editmemo";
// import Mytrips from "./trips/pages/Mytrips";
import Loadingspinner from "./shared/UIElements/Loadingspinner";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

const Trips = React.lazy(() => import("./trips/pages/Trips"));
const Memos = React.lazy(() => import("./trips/pages/Memos"));
const Login = React.lazy(() => import("./user/pages/Login"));
const Signup = React.lazy(() => import("./user/pages/Signup"));
const Newtrip = React.lazy(() => import("./trips/pages/Newtrip"));
const EditTrip = React.lazy(() => import("./trips/pages/EditTrip"));
const Addmemo = React.lazy(() => import("./trips/pages/Addmemo"));
const Editmemo = React.lazy(() => import("./trips/pages/Editmemo"));
const Mytrips = React.lazy(() => import("./trips/pages/Mytrips"));

function App() {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <Loadingspinner />
              </div>
            }
          >
            <Routes>
              <Route path="/" exact element={<Trips />} />
              <Route path="/:tripId/memos/:day" exact element={<Memos />} />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="/createtrip" exact element={<Newtrip />} />
              <Route path="/:tripId/edittrip" exact element={<EditTrip />} />
              <Route path="/mytrips" exact element={<Mytrips />} />
              <Route
                path="/:tripId/memos/:day/addmemo"
                exact
                element={<Addmemo />}
              />
              <Route
                path="/:tripId/memos/:day/:memoid/editmemo"
                exact
                element={<Editmemo />}
              />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
