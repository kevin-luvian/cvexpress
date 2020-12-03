import React, { Component } from "react";
import EducationElement from "../element/EduExp";
import styles from "./contents.module.scss";
import axios from "../../axios/Axios";

class Education extends Component {
  constructor(props) {
    super();
    this.state = { edus: [] };
  }
  componentDidMount = () => {
    this.fetchEdu();
  };
  fetchEdu = () => {
    axios
      .get("/api/resumes/education")
      .then((res) => {
        this.setState({ edus: res.data });
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
            <p>Education</p>
            <div className={styles.line}>
              <div />
              <div />
            </div>
          </div>
          <div className={styles.elementContainer}>
            {this.state.edus.map((data, i) => (
              <EducationElement key={i} data={data} />
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Education;
