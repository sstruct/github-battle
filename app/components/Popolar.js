import React from "react";

const languages = ["All", "JavaScript", "Ruby", "Java", "CSS", "Python"];

export default class Popular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: "All"
    };
  }
  updateLanguage(lang) {
    this.setState(() => ({
      selectedLanguage: lang
    }));
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
        selectedLanguage: {this.state.selectedLanguage}
      </div>
    );
  }
}
