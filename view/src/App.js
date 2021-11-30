import { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { baseUrl } from "./core";
import axios from "axios";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import LiveScore from "./pages/LiveScore";
import LiveScoreAdmin from "./pages/LiveScoreAdmin";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  let [isLogged, setIsLogged] = useState(false);
  axios
    .get(`${baseUrl}/api/v1/getcookie`)
    .then((res) => {
      setIsLogged(true);
    })
    .catch((e) => {
      console.log("error: ", e);
      setIsLogged(false);
    });
  return (
    <>
      {!isLogged ? (
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/livescore">
            <LiveScore />
          </Route>
          <Route exact path="/livescore-admin">
            <LiveScoreAdmin />
          </Route>
          <Redirect to="/" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/livescore">
            <LiveScore />
          </Route>
          <Route exact path="/livescore-admin">
            <LiveScoreAdmin />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Redirect to="/" />
        </Switch>
      )}
    </>
  );
}

export default App;
