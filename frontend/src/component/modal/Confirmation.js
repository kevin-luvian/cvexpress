import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import styles from "./confirmation.module.scss";

class Confirmation extends Component {
  render() {
    return (
      <Dialog open={this.props.value} onClose={this.props.close}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h4>{this.props.title}</h4>
          </div>
          <div className={styles.message}>
            <p className={styles.scrollbar}>{this.props.message}</p>
          </div>
          <div className={styles.warning}>
            <p>{this.props.warning}</p>
          </div>
          <div className={styles.action}>
            <button
              className={`${styles.button} ${styles.disagree}`}
              onClick={this.props.close}
            >
              Disagree
            </button>
            <button
              className={`${styles.button} ${styles.agree}`}
              onClick={this.props.submit}
            >
              Agree
            </button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default Confirmation;
