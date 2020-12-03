import React, { Component } from "react";
import { Link } from "react-router-dom";

class Error404Page extends Component {
  render() {
    return (
      <div className="text-center my-5">
        <div className="container">
          <h2>404</h2>
          <p>Ooops! Something went wrong .</p>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    );
  }
}

export default Error404Page;
