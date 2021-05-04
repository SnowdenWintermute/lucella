import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./css/main.css";
// redux
import { Provider } from "react-redux";
import store from "./store";
// components
import PrivateRoute from "./components/routing/PrivateRoute";
import Navbar from "./components/layout/navbar/Navbar";
import Alerts from "./components/layout/alerts/Alerts";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Settings from "./components/dashboard/Settings";
import RequestPasswordResetEmail from "./components/auth/RequestPasswordResetEmail";
import PasswordReset from "./components/auth/PasswordReset";
// import Landing from "./components/layout/Landing";
import Games from "./components/pages/games/Games";
import Ladder from "./components/pages/ladder/Ladder";
import Forum from "./components/pages/forum/Forum";
import Profile from "./components/profile/Profile";
import BattleRoomShell from "./components/pages/games/battle-room/BattleRoomShell";

// actions
import { loadUser } from "./store/actions/auth";

// utils
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) { setAuthToken(localStorage.token) }

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
          <Route exact path="/" component={BattleRoomShell}></Route>
          <Route exact path="/register" component={Register}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route
            exact
            path="/request-password-reset"
            component={RequestPasswordResetEmail}
          ></Route>
          <Route
            exact
            path="/password-reset/:token"
            component={PasswordReset}
          ></Route>
          <Route exact path="/games" component={Games}></Route>
          <Route exact path="/battle-room" component={BattleRoomShell}></Route>
          <Route exact path="/ladder" component={Ladder}></Route>
          <Route exact path="/forum" component={Forum}></Route>
          <Route exact path="/profile" component={Profile}></Route>
          <PrivateRoute
            exact
            path="/settings"
            component={Settings}
          ></PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
