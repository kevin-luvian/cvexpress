import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import SkillForm from "../../form/resume/SkillForm";
import styles from "./modaledit.module.scss";

class WhatIDo extends Component {
  componentDidMount = () => {
    console.log("props", this.props.data);
  };
  render() {
    return (
      <Dialog open={this.props.value} onClose={this.props.close}>
        <div className={`themeforest ${styles.root}`}>
          <h1>Skill</h1>
          <SkillForm
            isEdit={true}
            _id={this.props.data._id}
            category={this.props.data.category}
            title={this.props.data.title}
            percentage={this.props.data.percentage}
            reload={() => {
              this.props.close();
              this.props.reload();
            }}
          />
        </div>
      </Dialog>
    );
  }
}

export default WhatIDo;
