import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import FunFactForm from "../../form/edit/FunFactForm";
import styles from "./modaledit.module.scss";

class WhatIDo extends Component {
  render() {
    return (
      <Dialog open={this.props.value} onClose={this.props.close}>
        <div className={`themeforest ${styles.root}`}>
          <h1>Fun Fact</h1>
          <FunFactForm
            isEdit={true}
            _id={this.props.data._id}
            icon={this.props.data.icon}
            title={this.props.data.title}
            number={this.props.data.number}
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
