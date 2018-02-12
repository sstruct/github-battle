import React from "react";
import { fetchPopularRepos } from "../utils/api";

function RepoGrid(props) {
  return (
    <ul className="popular-list">
      {props.repos.map(function(repo, index) {
        return (
          <li key={repo.name} className="popular-item">
            <div className="popular-rank">#{index + 1}</div>
            <ul className="space-list-items">
              <li>
                <img
                  className="avatar"
                  src={repo.owner.avatar_url}
                  alt={"Avatar for " + repo.owner.login}
                />
              </li>
              <li>
                <a href={repo.html_url}>{repo.name}</a>
              </li>
              <li>@{repo.owner.login}</li>
              <li>{repo.stargazers_count} stars</li>
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];
export default class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "All",
      repos: null
    };
  }
  componentDidMount() {
    this.updateLanguage(this.state.selectedLanguage);
  }
  updateLanguage = lang => {
    this.setState(() => ({
      selectedLanguage: lang,
      repos: null
    }));
    fetchPopularRepos(lang).then(res => {
      this.setState({
        repos: res
      });
    });
  };
  render() {
    return (
      <div>
        <ul className="languages">
          {languages.map(lang => (
            <li
              style={
                this.state.selectedLanguage === lang
                  ? { color: "#d0021b" }
                  : null
              }
              onClick={() => this.updateLanguage(lang)}
              key={lang}
            >
              {lang}
            </li>
          ))}
        </ul>
        {this.state.repos ? (
          <RepoGrid repos={this.state.repos} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}
