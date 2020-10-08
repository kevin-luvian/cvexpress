import React, { Component } from "react";
import Divider from "@material-ui/core/Divider";
import Navbar from "../navbar/Navbar";
import styles from "./main.module.scss";

class MainTemplate extends Component {
  constructor(props) {
    super();
    this.state = { styleid: 0 };
  }
  chooseTheme = () => {
    if (this.state.styleid === 0) return "themeforest";
    return "themecalm";
  };
  render() {
    return (
      <div className={this.chooseTheme()}>
        <div className={styles.root}>
          <div id="rootContainer" className={styles.container}>
            <Navbar />
            <div className={styles.containerContent}>{this.props.children}</div>
            <div className={styles.footer}>
              <Divider className={styles.divider} />
              <p className={styles.copyright}>© 2020 All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainTemplate;
