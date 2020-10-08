import React, { Component } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import EducationContent from "../../content/Education";
import ExperienceContent from "../../content/Experience";
import SkillsContent from "../../content/Skills";
import styles from "./resumepage.module.scss";

class ResumePage extends Component {
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
          className={`${styles.root} ${
            this.state.loading ? "d-none" : "d-block"
          }`}
        >
          <div className={styles.pageHeader}>
            <h1>Resume</h1>
            <p>8 Years of Experience</p>
          </div>
          <div className={styles.contents}>
            <div className={styles.eduExpContainer}>
              <EducationContent requireLoad={true} onLoad={this.count} />
              <ExperienceContent requireLoad={true} onLoad={this.count} />
            </div>
            <SkillsContent requireLoad={true} onLoad={this.count} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ResumePage;
