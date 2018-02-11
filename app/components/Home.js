import React from "react";
import { Link } from "react-router-dom";

export default class HOME extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Link className="button" to="/battle">
          Battle!
        </Link>
      </div>
    );
  }
}
