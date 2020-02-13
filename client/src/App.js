import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./css/main.css";
// redux
import { Provider } from "react-redux";
import store from "./store";
// components
import Navbar from "./components/layout/Navbar";
import Alerts from "./components/layout/Alerts";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import RequestPasswordResetEmail from "./components/auth/RequestPasswordResetEmail";
import Landing from "./components/layout/Landing";
import Games from "./components/pages/games/Games";
import Ladder from "./components/pages/ladder/Ladder";
import Forum from "./components/pages/forum/Forum";
import Profile from "./components/profile/Profile";

// actions
import { loadUser } from "./actions/auth";

// utils
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // without the brackets, this will run forever. Else it is like component did mount. the [] is where you can put properties that if they update, will run the func

  return (
    <Provider store={store}>
      <Router>
        <Navbar></Navbar>
        <Alerts></Alerts>
        <section className="page-frame">
          <Switch>
            <Route exact path="/" component={Landing}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route
              exact
              path="/request-password-reset"
              component={RequestPasswordResetEmail}
            ></Route>
            <Route exact path="/games" component={Games}></Route>
            <Route exact path="/ladder" component={Ladder}></Route>
            <Route exact path="/forum" component={Forum}></Route>
            <Route exact path="/profile" component={Profile}></Route>
          </Switch>
        </section>
      </Router>
    </Provider>
  );
}

export default App;
