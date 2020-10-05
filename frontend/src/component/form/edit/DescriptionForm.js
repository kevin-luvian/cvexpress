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
      bio: "",
      selectedImage: "",
      selectedCV: "",
      files: [],
    };
    this.notif = React.createRef();
  }
  componentDidMount = () => {
    this.fetchFileMetadatas();
    this.fetchDescription();
  };
  fetchFileMetadatas = () => {
    axios
      .get("/api/files")
      .then((response) => {
        this.setState({ files: response.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.current.display(errmsg, "danger");
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
          bio: res.data.quickDescription,
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
          this.notif.current.display(errmsg, "danger");
        }
      });
  };
  postDescription = () => {
    const data = {
      professions: this.state.professions,
      quickBio: this.state.bio,
      imageFile: this.state.selectedImage,
      cvFile: this.state.selectedCV,
    };
    axios
      .post("/api/description", data)
      .then(() => {
        this.fetchDescription();
        this.notif.current.display("description data updated", "success");
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          this.notif.current.display(errmsg, "danger");
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
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
            label="Quick Bio"
            multiline
            rows={2}
            rowsMax={5}
            value={this.state.bio}
            onChange={(e) => {
              this.setState({ bio: e.target.value });
            }}
          />
          <TextField
            select
            label="Select Image"
            className={styles.input}
            value={this.state.selectedImage}
            onChange={(e) => {
              this.setState({ selectedImage: e.target.value });
            }}
          >
            {this.state.files.map((file) => (
              <MenuItem key={file._id} value={file._id}>
                {file.originalName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Select CV"
            className={styles.input}
            value={this.state.selectedCV}
            onChange={(e) => {
              this.setState({ selectedCV: e.target.value });
            }}
          >
            {this.state.files.map((file) => (
              <MenuItem key={file._id} value={file._id}>
                {file.originalName}
              </MenuItem>
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
