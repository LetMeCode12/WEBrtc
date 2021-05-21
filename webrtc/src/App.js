import React, { Component, lazy, Suspense } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.scss";
import Loader from "./components/loader/loader";

const Video = lazy(() => import("./containers/video/video"));
const Test = lazy(() => new Promise(res=>setTimeout(() => res(import("./containers/video/video")),10000000000000000)))

class App extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={<Loader />}>
          <Router>
            <Switch>
              <Route path="/" exact />
              <Route
                path="/video"
                component={(props) => <Video {...props} />}
              />
              <Route
                path="/test"
                component={(props) => <Test {...props} />}
              />
            </Switch>
          </Router>
        </Suspense>
      </div>
    );
  }
}

export default App;
