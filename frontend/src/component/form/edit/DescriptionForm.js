import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowIcon from "@material-ui/icons/ArrowRight";
import axios from "../../../axios/Axios";
import styles from "./editform.module.scss";

class DescriptionForm extends Component {
  constructor(props) {
    super();
    this.state = {
      professions: "",
      quickDescription: "",
      selectedImage: null,
      selectedCV: null,
      files: [],
    };
    this.notif = null;
  }
  addNotif = element => {
    if (element !== null) {
      this.notif = element;
    };
  };
  componentDidMount = () => {
    this.fetchFileMetadatas();
    this.fetchDescription();
  };
  fetchFileMetadatas = () => {
    axios
      .get("/api/files")
      .then((res) => {
        console.log("Files", res.data)
        this.setState({ files: res.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.display(errmsg, "danger");
        }
      });
  };
  fetchDescription = () => {
    axios
      .get("/api/description")
      .then((res) => {
        console.log("Desc info", res.data);
        this.setState({
          professions: res.data.professions.join(", "),
          quickDescription: res.data.quickDescription,
          selectedImage: res.data.imageID,
          selectedCV: res.data.cvID,
        });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.display(errmsg, "danger");
        }
      });
  };
  postDescription = () => {
    const data = {
      professions: this.state.professions,
      quickDescription: this.state.quickDescription,
      imageID: this.state.selectedImage,
      cvID: this.state.selectedCV,
    };
    axios
      .post("/api/description", data)
      .then(() => {
        this.fetchDescription();
        this.notif.display("description data updated", "success");
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.display(errmsg, "danger");
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.addNotif} />
        <div className={styles.root}>
          <TextField
            className={styles.input}
            label="Professions"
            value={this.state.professions}
            onChange={(e) => {
              this.setState({ professions: e.target.value });
            }}
          />
          <TextField
            className={styles.input}
            label="Quick Description"
            multiline
            rows={2}
            rowsMax={5}
            value={this.state.quickDescription}
            onChange={(e) => {
              this.setState({ quickDescription: e.target.value });
            }}
          />
          <TextField
            select
            label="Select Image"
            className={styles.input}
            value={this.state.selectedImage || ""}
            onChange={(e) => {
              this.setState({ selectedImage: e.target.value });
            }}
          >
            {this.state.files.map((file, index) => (
              <MenuItem key={index} value={file._id}>{file.filename}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select CV"
            className={styles.input}
            value={this.state.selectedCV || ""}
            onChange={(e) => {
              this.setState({ selectedCV: e.target.value });
            }}
          >
            {this.state.files.map((file, index) => (
              <MenuItem key={index} value={file._id}>{file.filename}</MenuItem>
            ))}
          </TextField>
          <div className="text-center">
            <button className={styles.button} onClick={this.postDescription}>
              <p>Submit</p> <ArrowIcon />
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DescriptionForm;
