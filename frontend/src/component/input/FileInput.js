import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconFile from "@material-ui/icons/InsertDriveFileOutlined";
import { randId } from "../../service/utils";
import styles from "./fileinput.module.scss";

class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilename: "",
      renderFile: null,
      hiddenInputId: randId(),
    };
  }
  onFileChange = (event) => {
    this.setState({
      selectedFilename: event.target.files[0].name,
    });
    this.props.onChange(event.target.files[0]);
  };
  render() {
    return (
      <React.Fragment>
        <Paper component="form" className={`${styles.form}`}>
          <div className={styles.root}>
            <InputBase
              className={styles.input}
              disabled
              placeholder="Input File"
              value={this.state.selectedFilename}
              inputProps={{
                "aria-label": "input file",
                className: styles.inputField,
              }}
            />
            <Divider className={styles.divider} orientation="vertical" />
            <input
              className={styles.hide}
              id={this.state.hiddenInputId}
              multiple
              type="file"
              onChange={this.onFileChange}
            />
            <label className={styles.label} htmlFor={this.state.hiddenInputId}>
              <Button
                className={styles.uploadButton}
                variant="contained"
                component="span"
              >
                <IconFile className={styles.icon} />
              </Button>
            </label>
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}
FileInput.propTypes = {
  onSumbit: PropTypes.func,
};
export default FileInput;
