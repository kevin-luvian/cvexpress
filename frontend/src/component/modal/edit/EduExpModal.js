import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import EduExpForm from "../../form/resume/EduExpForm";
import styles from "./modaledit.module.scss";

class EduExpModal extends Component {
  getYear = () => {
    return this.props.data.year.split(" - ");
  };
  render() {
    return (
      <Dialog open={this.props.value} onClose={this.props.close}>
        <div className={`themeforest ${styles.root}`} style={{ minWidth: "70vw" }}>
          <h1>Education/Experience</h1>
          <EduExpForm
            isEdit={true}
            _id={this.props.data._id}
            type={this.props.data.type}
            year={this.getYear()[0]}
            yearEnd={this.getYear()[1]}
            smallDesc={this.props.data.smallDesc}
            title={this.props.data.title}
            description={this.props.data.description}
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

export default EduExpModal;
