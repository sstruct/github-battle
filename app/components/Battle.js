import React from "react";
import { Link } from "react-router-dom";

function PlayerPreview(props) {
  return (
    <div>
      <div className="column">
        <img
          className="avatar"
          src={props.avatar}
          alt={"Avatar for " + props.username}
        />
        <h2 className="username">@{props.username}</h2>
      </div>
      <button className="reset" onClick={props.onReset}>
        Reset
      </button>
    </div>
  );
}
class PlayerInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ""
    };
  }
  handleChange = event => {
    const value = event.target.value;
    this.setState(() => ({
      username: value
    }));
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.onSubmit(this.props.id, this.state.username);
  };
  render() {
    return (
      <form className="column" onSubmit={this.handleSubmit}>
        <label className="header" htmlFor="username">
          {this.props.label}
        </label>
        <input
          id="username"
          placeholder="github username"
          type="text"
          value={this.state.username}
          autoComplete="off"
          onChange={this.handleChange}
        />
        <button
          className="button"
          type="submit"
          disabled={!this.state.username}
        >
          Submit
        </button>
      </form>
    );
  }
}
export default class Battle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerOneName: "",
      playerTwoName: "",
      playerOneImage: null,
      playerTwoImage: null
    };
  }
  // ref: http://babeljs.io/docs/plugins/transform-class-properties/
  handleSubmit = (id, username) => {
    this.setState(() => {
      var newState = {};
      newState[id + "Name"] = username;
      newState[id + "Image"] =
        "https://github.com/" + username + ".png?size=200";
      return newState;
    });
  };
  handleReset = id => {
    this.setState(() => ({
      [id + "Name"]: "",
      [id + "Image"]: null
    }));
  };
  render() {
    const { match } = this.props;
    const {
      playerOneName,
      playerOneImage,
      playerTwoName,
      playerTwoImage
    } = this.state;

    return (
      <div>
        <div className="row">
          {!playerOneName && (
            <PlayerInput
              id="playerOne"
              label="Player One"
              onSubmit={this.handleSubmit}
            />
          )}
          {playerOneImage !== null && (
            <PlayerPreview
              avatar={playerOneImage}
              username={playerOneName}
              onReset={() => this.handleReset("playerOne")}
            />
          )}
          {!playerTwoName && (
            <PlayerInput
              id="playerTwo"
              label="Player Two"
              onSubmit={this.handleSubmit}
            />
          )}
          {playerTwoImage !== null && (
            <PlayerPreview
              avatar={playerTwoImage}
              username={playerTwoName}
              onReset={() => this.handleReset("playerTwo")}
            />
          )}
        </div>
        {playerOneImage &&
          playerTwoImage && (
            <Link
              className="button"
              to={{
                pathname: match.url + "/results",
                search:
                  "?playerOneName=" +
                  playerOneName +
                  "&playerTwoName=" +
                  playerTwoName
              }}
            >
              Battle
            </Link>
          )}
      </div>
    );
  }
}
