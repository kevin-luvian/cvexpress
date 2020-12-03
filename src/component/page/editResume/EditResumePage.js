import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import Divider from "@material-ui/core/Divider";
import SkillForm from "../../form/resume/SkillForm";
import EduExpForm from "../../form/resume/EduExpForm";
import EduExpElement from "../../element/EduExp";
import SkillsContent from "../../content/Skills";
import styles from "./editresumepage.module.scss";
import axios from "../../../axios/Axios";

class EditResumePage extends Component {
  constructor(props) {
    super();
    this.state = {
      edus: [],
      exps: [],
      skills: [],
    };
    this.notif = React.createRef();
    this.skills = React.createRef();
  }
  componentDidMount = () => {
    this.fetchEdu();
    this.fetchExp();
  };
  fetchEdu = () => {
    axios
      .get("/api/resumes/education")
      .then((res) => {
        console.log("Edu data", res.data);
        this.setState({ edus: res.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.current.display(errmsg, "danger");
        }
      });
  };
  fetchExp = () => {
    axios
      .get("/api/resumes")
      .then((res) => {
        console.log("Exp data", res.data);
        this.setState({ exps: res.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.current.display(errmsg, "danger");
        }
      });
  };
  reloadSkill = () => {
    this.skills.current.reload();
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <div className={`${styles.root} col-12 col-md-10 mx-auto`}>
          <div className={styles.container}>
            <div className={styles.header}>Education</div>
            <div className={styles.inputContainer}>
              <EduExpForm isEdu={true} reload={this.fetchEdu} />
            </div>
            {this.state.edus.length > 0 && (
              <Divider className={styles.divider} />
            )}
            {this.state.edus.map((data, i) => (
              <EduExpElement
                key={i}
                edit={true}
                data={data}
                reload={this.fetchEdu}
              />
            ))}
          </div>
          <div className={styles.container}>
            <div className={styles.header}>Experience</div>
            <div className={styles.inputContainer}>
              <EduExpForm reload={this.fetchExp} />
            </div>
            {this.state.exps.length > 0 && (
              <Divider className={styles.divider} />
            )}
            {this.state.exps.map((data, i) => (
              <EduExpElement
                key={i}
                edit={true}
                data={data}
                reload={this.fetchExp}
              />
            ))}
          </div>
          <div className={styles.container}>
            <div className={styles.header}>Skills</div>
            <div className={styles.inputContainer}>
              <SkillForm reload={this.reloadSkill} />
            </div>
            <Divider className={styles.divider} />
            <SkillsContent ref={this.skills} edit={true} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditResumePage;
