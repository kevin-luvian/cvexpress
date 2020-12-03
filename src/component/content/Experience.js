import React, { Component } from "react";
import ExperienceElement from "../element/EduExp";
import axios from "../../axios/Axios";
import styles from "./contents.module.scss";

class Experience extends Component {
  constructor(props) {
    super();
    this.state = { exps: [] };
  }
  componentDidMount = () => {
    this.fetchExp();
  };
  fetchExp = () => {
    axios
      .get("/api/resumes/experience")
      .then((res) => {
        this.setState({ exps: res.data });
        if (this.props.requireLoad) {
          this.props.onLoad();
        }
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          console.log("Error", errmsg);
          if (this.props.requireLoad) {
            this.props.onLoad();
          }
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <div className={styles.root}>
          <div className={styles.title}>
            <p>Experience</p>
            <div className={styles.line}>
              <div />
              <div />
            </div>
          </div>
          <div className={styles.elementContainer}>
            {this.state.exps.map((data, i) => (
              <ExperienceElement key={i} data={data} />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Experience;
