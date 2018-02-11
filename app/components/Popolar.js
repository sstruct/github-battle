import React from "react";
import { fetchPopularRepos } from "../utils/api";

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
  updateLanguage(lang) {
    this.setState(() => ({
      selectedLanguage: lang,
      repos: null
    }));
    fetchPopularRepos(lang).then(res => {
      this.setState({
        repos: res
      });
    });
  }
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
        {JSON.stringify(this.state.repos)}
      </div>
    );
  }
}
