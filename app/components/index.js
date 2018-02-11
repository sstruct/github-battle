import React from "react";
import Popular from "./Popolar";
import ReactRouter, {
  Route,
  Switch,
  BrowserRouter as Router
} from "react-router-dom";
import Home from "./Home";
import Battle from "./Battle";
import Nav from "./Nav";

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="container">
          <Nav />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/battle" component={Battle} />
            <Route path="/popular" component={Popular} />
            <Route
              render={() => {
                return <p>Not Found</p>;
              }}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
