import React, { Component } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import DescriptionContent from "../../content/Description";
import WhatIDoContent from "../../content/WhatIDo";
import FunFactsContent from "../../content/FunFacts";
import styles from "./homepage.module.scss";

class HomePage extends Component {
  constructor(props) {
    super();
    this.state = { loadCount: 0, loading: true };
  }
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (
      this.state.loadCount !== prevState.loadCount &&
      this.state.loadCount >= 3
    ) {
      this.setState({ loading: false });
    }
  };
  count = () => {
    this.setState({ loadCount: this.state.loadCount + 1 }, () => {
      console.log("Counted", this.state.loadCount);
    });
  };
  render() {
    return (
      <React.Fragment>
        {this.state.loading && (
          <div className={styles.loader}>
            <PuffLoader loading={true} />
            <div className={styles.fill} />
          </div>
        )}
        <div
          className={`${styles.root} col-12 col-md-10 mx-auto ${
            this.state.loading ? "d-none" : "d-block"
          }`}
        >
          <DescriptionContent requireLoad={true} onLoad={this.count} />
          <div className={styles.gap}>
            <WhatIDoContent requireLoad={true} onLoad={this.count} />
            <FunFactsContent requireLoad={true} onLoad={this.count} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default HomePage;
