import React, { Component, lazy, Suspense } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Loader from "./components/loader/loader";

const Login = lazy(() => import("./containers/login/login"));
const Video = lazy(() => import("./containers/video/video"));
const AuthRoute = lazy(() => import("./components/authRoute/authRoute"));


class App extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={<Loader />}>
          <Router>
            <Switch>
              <AuthRoute
                exact
                path="/"
                component={(props) => <Video {...props} />}
              />
              <Route
                path="/login"
                component={(props) => <Login {...props} />}
              />
            </Switch>
          </Router>
        </Suspense>
      </div>
    );
  }
}

export default App;
