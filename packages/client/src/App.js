import "./css/main.css";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./components/routing/PrivateRoute";
import Navbar from "./components/layout/navbar/Navbar";
import Alerts from "./components/layout/alerts/Alerts";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Settings from "./components/dashboard/Settings";
import RequestPasswordResetEmail from "./components/auth/RequestPasswordResetEmail";
import PasswordReset from "./components/auth/PasswordReset";
import Ladder from "./components/pages/ladder/Ladder";
import Profile from "./components/profile/Profile";
import BattleRoomShell from "./components/pages/games/battle-room/BattleRoomShell";
import { loadUser } from "./store/actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) setAuthToken(localStorage.token);

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar></Navbar>
        <Alerts></Alerts>
        <Switch>
          <Redirect exact from="/" to="/battle-room" />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/request-password-reset" component={RequestPasswordResetEmail} />
          <Route exact path="/password-reset/:token" component={PasswordReset} />
          <Route exact path="/battle-room" component={BattleRoomShell} />
          <Route exact path="/ladder" component={Ladder} />
          <Route exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/settings" component={Settings}></PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
