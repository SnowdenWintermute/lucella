import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./css/main.css";
// redux
import { Provider } from "react-redux";
import store from "./store";
// components
import Navbar from "./components/layout/Navbar";
import Alerts from "./components/layout/Alerts";
import Login from "./components/auth/Login";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar></Navbar>
        <Alerts></Alerts>
        <section className="page-frame">
          <Switch>
            <Route exact path="/login" component={Login}></Route>
          </Switch>
        </section>
      </Router>
    </Provider>
  );
}

export default App;
