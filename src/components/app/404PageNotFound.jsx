import React, { Component } from "react";

class NoRouteFound extends Component {
  state = {};

  render() {
    return (
      <div>
          <img className="not-found"  src="./images/notfound.gif" alt="notfound" />
      </div>
    );
  }
}

export default NoRouteFound;
