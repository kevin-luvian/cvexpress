import React, { Component } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import FileInput from "../input/FileInput";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Publish from "@material-ui/icons/Publish";
import Alert from "@material-ui/lab/Alert";
import styles from "./uploadform.module.scss";
import axios from "../../axios/Axios";
import { toMb } from "../../service/utils";

class UploadForm extends Component {
  constructor(props) {
    super();
    this.state = {
      alert: { display: false, type: "", message: "" },
      progress: false,
      selectedFile: null,
      renderFile: null,
    };
  }
  handleChange = (file) => {
    this.resetAlert();
    this.setState({
      selectedFile: file,
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
    axios
      .post("/api/files", formData, {
        headers: { size: file.size },
      })
      .then((response) => {
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
      .catch((error) => {
        console.log("Error", error.response);
        this.setState({
          progress: false,
          alert: {
            display: true,
            type: "error",
            message: error.response.data.message,
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
                  <h5 className={`${styles.textHeading} overflow-hidden`}>
                    {this.state.selectedFile.name}
                  </h5>
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
                          <CloseIcon fontSize="inherit" />
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
