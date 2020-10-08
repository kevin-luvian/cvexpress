import React, { Component } from "react";
import {
  TextField,
  Paper,
  Button,
  IconButton,
  LinearProgress
} from "@material-ui/core";
import {
  Close,
  Publish
} from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import styles from "./uploadform.module.scss";
import FileInput from "../input/FileInput";
import axios from "../../axios/Axios";
import { toMb } from "../../service/utils";

class UploadForm extends Component {
  constructor(props) {
    super();
    this.state = {
      alert: { display: false, type: "", message: "" },
      progress: false,
      selectedFilename: "",
      selectedFile: null,
      renderFile: null,
    };
  }
  handleChange = (file) => {
    this.resetAlert();
    this.setState({
      selectedFile: file,
      selectedFilename: file.name,
      renderFile: URL.createObjectURL(file),
    });
  };
  handleUpload = () => {
    this.setState({ progress: true });
    let file = this.state.selectedFile;
    if (!file) {
      console.log("no file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("file[name]", this.state.selectedFilename);
    axios
      .post("/api/files", formData, {
        headers: { 
          filename:  this.state.selectedFilename,
          size: file.size 
        }
      })
      .then(() => {
        this.setState({
          progress: false,
          alert: {
            display: true,
            type: "success",
            message: "file successfully uploaded",
          },
        });
        this.props.reload();
      })
      .catch((err) => {
        console.log("Error", err.response);
        this.setState({
          progress: false,
          alert: {
            display: true,
            type: "error",
            message: err.response.data.error,
          },
        });
      });
  };
  resetAlert = () => {
    this.setState({
      alert: { ...this.state.alert, display: false },
    });
  };
  render() {
    return (
      <React.Fragment>
        <div className={styles.container}>
          <FileInput onChange={this.handleChange} />
          {this.state.renderFile && (
            <div className="text-center mt-2">
              <Paper className={`${styles.imageContainer} ${styles.row}`}>
                {this.state.selectedFile.type.includes("image") && (
                  <div className={`col-7 ${styles.col}`}>
                    <img
                      className={styles.image}
                      src={this.state.renderFile}
                      alt="file"
                    />
                  </div>
                )}
                <div
                  className={`${styles.textArea} ${styles.col} col text-left`}
                >
                  <TextField
                    className={'w-100 mb-3'}
                    label="Filename"
                    value={this.state.selectedFilename}
                    onChange={(e) => {
                      this.setState({ selectedFilename: e.target.value });
                    }}
                  />
                  <p className={styles.text}>
                    size &emsp; : {toMb(this.state.selectedFile.size)}mb
                  </p>
                  <p className={styles.text}>
                    type &emsp; : {this.state.selectedFile.type}
                  </p>
                  {this.state.progress && (
                    <LinearProgress className={styles.progressbar} />
                  )}
                  {this.state.alert.display && (
                    <Alert
                      variant="filled"
                      severity={this.state.alert.type}
                      action={
                        <IconButton
                          color="inherit"
                          size="small"
                          onClick={() => {
                            this.resetAlert();
                          }}
                        >
                          <Close fontSize="inherit" />
                        </IconButton>
                      }
                    >
                      {this.state.alert.message}
                    </Alert>
                  )}
                  <Button
                    className={`mt-1 ${styles.submitButton}`}
                    onClick={this.handleUpload}
                  >
                    <span>
                      <Publish />
                    </span>{" "}
                    upload
                  </Button>
                </div>
              </Paper>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default UploadForm;
