import React, { Component } from "react";
import { Dialog, TextField } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import styles from "./modaledit.module.scss";

class FileEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: this.props.filename || "",
      contentType: this.props.contentType || "",
    };
    const baseState = { ...this.state }
  }
  close = () => {
    this.setState(this.baseState);
    this.props.close();
  }
  submit = () => {
    this.props.submit(this.state)
  }
  render() {
    return (
      <React.Fragment>
        <Dialog open={this.props.value} onClose={this.close}>
          <div className={`themeforest ${styles.root}`} style={{ minWidth: "70vw" }}>
            <h1>File</h1>
            <TextField
              className={'w-100 my-3'}
              label="Filename"
              value={this.state.filename}
              onChange={(e) => {
                this.setState({ filename: e.target.value });
              }}
            />
            <TextField
              className={'w-100 my-3'}
              label="Content-Type"
              value={this.state.contentType}
              onChange={(e) => {
                this.setState({ contentType: e.target.value });
              }}
            />
            <div className="text-center">
              <button
                className={styles.button}
                onClick={this.submit}
              >
                <p>Submit</p> <ArrowRight />
              </button>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default FileEdit;
