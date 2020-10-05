import React, { Component } from "react";
import NotificationService from "../standalone/NotificationService";
import SkillElement from "../element/Skill";
import stylesPrimary from "./skills.module.scss";
import styles from "./contents.module.scss";
import axios from "../../axios/Axios";

class Skills extends Component {
  constructor(props) {
    super();
    this.state = { data: [] };
    this.notif = React.createRef();
  }
  componentDidMount = () => {
    this.fetchSkill();
  };
  fetchSkill = () => {
    axios
      .get("/api/skills/group")
      .then((res) => {
        console.log("Skill data", res.data);
        this.setState({ data: res.data });
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
          this.notif.current.display(errmsg, "danger");
          if (this.props.requireLoad) {
            this.props.onLoad();
          }
        }
      });
  };
  reload = () => {
    this.fetchSkill();
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <div className={stylesPrimary.root}>
          {this.state.data.map((skillgroup, i) => (
            <div
              key={i}
              className={`${styles.root} ${stylesPrimary.container}`}
            >
              <div className={styles.title}>
                <p>{skillgroup.category}</p>
                <div className={styles.line}>
                  <div />
                  <div />
                </div>
              </div>
              <div className={stylesPrimary.elementContainer}>
                {skillgroup.elements.map((elemData, i) => (
                  <SkillElement
                    key={i}
                    data={elemData}
                    edit={this.props.edit}
                    reload={this.fetchSkill}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}
export default Skills;
