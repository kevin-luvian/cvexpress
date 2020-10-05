import React, { Component } from "react";
import styles from "./contents.module.scss";

class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div className={styles.root}>
          <div className={styles.title}>
            <p>Certificates</p>
            <div className={styles.line}>
              <div />
              <div />
            </div>
          </div>
          <div className={styles.elementContainer}></div>
        </div>
      </React.Fragment>
    );
  }
}
export default Certificate;
