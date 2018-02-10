import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const names = ["Adam", "Eva", "God", "Snake"];

export default class App extends React.Component {
  render() {
    return (
      <div>
        Names:
        <ul>{names.map(o => <li key={o}>{o}</li>)}</ul>
      </div>
    );
  }
}

// About Pure function

// pure
var friends = ["Ryan", "Michael", "Dan"];
friends.slice(0, 1); // 'Ryan'
friends.slice(0, 1); // 'Ryan'
friends.slice(0, 1); // 'Ryan'

// unpure
friends.splice(0, 1); // ["Ryan"]
friends.splice(0, 1); // ["Michael"]
friends.splice(0, 1); // ["Dan"]

ReactDOM.render(<App />, document.getElementById("app"));
