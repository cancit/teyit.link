import React, { Component } from "react";

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
    const params = window.location.search.substring(1).split("&");
    let query = "",
      after = "",
      before = "";
    params.forEach(p => {
      const o = p.split("=");
      if (o[0] === "q") {
        query = o[1];
      } else if (o[0] === "after") {
        after = o[1];
      } else if (o[0] === "before") {
        before = o[1];
      }
    });

    this.state = { query, after, before };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleAfterChange = this.handleAfterChange.bind(this);
    this.handleBeforeChange = this.handleBeforeChange.bind(this);
  }
  handleQueryChange(event) {
    this.setState({ query: event.target.value });
  }
  handleAfterChange(event) {
    this.setState({ after: event.target.value });
  }
  handleBeforeChange(event) {
    this.setState({ before: event.target.value });
  }
  render() {
    const { query, after, before } = this.state;
    return (
      <form method="GET" action="/search">
        <div className="row">
          <input
            className="flipkart-navbar-input col-xs-11"
            type="text"
            placeholder="Ara..."
            name="q"
            value={query}
            onChange={this.handleQueryChange}
          />
          <button className="flipkart-navbar-button col-xs-1" type="submit">
            <svg width="15px" height="15px">
              <path
                fill="#fff"
                d="M11.618 9.897l4.224 4.212c.092.09.1.23.02.312l-1.464 1.46c-.08.08-.222.072-.314-.02L9.868 11.66M6.486 10.9c-2.42 0-4.38-1.955-4.38-4.367 0-2.413 1.96-4.37 4.38-4.37s4.38 1.957 4.38 4.37c0 2.412-1.96 4.368-4.38 4.368m0-10.834C2.904.066 0 2.96 0 6.533 0 10.105 2.904 13 6.486 13s6.487-2.895 6.487-6.467c0-3.572-2.905-6.467-6.487-6.467 "
              />
            </svg>
          </button>
        </div>
        <div className="row" style={{ marginTop: "1%" }}>
          Başlangıç Tarihi:
          <input
            type="date"
            name="after"
            value={after}
            onChange={this.handleAfterChange}
          />
        </div>
        <div className="row" style={{ marginTop: "1%" }}>
          Bitiş Tarihi:
          <input
            type="date"
            name="before"
            value={before}
            onChange={this.handleBeforeChange}
          />
        </div>
      </form>
    );
  }
}
