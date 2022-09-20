import "./css/main.css";
import * as React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./components/routing/PrivateRoute";
import Navbar from "./components/layout/navbar/Navbar";
import AlertsHolder from "./components/layout/alerts/AlertsHolder";
import Register from "./components/pages/auth/Register";
import Login from "./components/pages/auth/Login";
import Settings from "./components/pages/dashboard/Settings";
import RequestPasswordResetEmail from "./components/pages/auth/RequestPasswordResetEmail";
import PasswordReset from "./components/pages/auth/PasswordReset";
import Ladder from "./components/pages/ladder/Ladder";
import BattleRoomShell from "./components/pages/games/battle-room/BattleRoomShell";
import { loadUser } from "./store/actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) setAuthToken(localStorage.token);

function App() {
  React.useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <AlertsHolder />
        <Switch>
          <Redirect exact from="/" to="/battle-room" />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/request-password-reset" component={RequestPasswordResetEmail} />
          <Route exact path="/password-reset/:token" component={PasswordReset} />
          <Route exact path="/battle-room" component={BattleRoomShell} />
          <Route exact path="/ladder" component={Ladder} />
          <PrivateRoute exact path="/settings" component={Settings}></PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
