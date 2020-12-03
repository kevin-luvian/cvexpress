import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import DirectoryFormEdit from "../../form/edit/DirectoryFormEdit";
import ArrowRight from "@material-ui/icons/ArrowRight";
import styles from "./directorypage.module.scss";
import axios from "../../../axios/Axios";

class AddDirectoryPage extends Component {
  constructor(props) {
    super();
    this.state = {
      files: [],
      mainDirRef: null,
      mainDir: { main: true }
    };
    this.notif = null;
  };
  componentDidMount = () => {
    this.fetchFiles();
  };
  addDirRef = element => {
    this.setState({ mainDirRef: element });
  };
  composeDir = () => {
    if (this.state.mainDirRef)
      this.postDirectories(this.state.mainDirRef.compose(true));
  }
  updateMainDir = () => {
    if (this.state.mainDirRef)
      this.setState({ mainDir: this.state.mainDirRef.compose() });
  }
  fetchFiles = () => {
    axios
      .get("/api/files")
      .then((res) => {
        this.setState({ files: res.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.error;
        } catch {
        } finally {
          this.notif.display(errmsg, "danger");
        }
      });
  }
  postDirectories = (data) => {
    axios
      .post("/api/directories", data)
      .then(() => {
        this.notif.display("directories data created", "success");
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
        <NotificationService
          ref={(element) => {
            if (element !== null) this.notif = element;
          }}
        />
        <div className={`${styles.root} col-12 col-md-10 mx-auto`}>
          <DirectoryFormEdit
            ref={this.addDirRef}
            updateMainDir={this.updateMainDir}
            directory={this.state.mainDir}
            allFiles={this.state.files} />
          <div className="text-center my-3">
            <button className={styles.button} onClick={this.composeDir}>
              <p>Submit</p> <ArrowRight />
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default AddDirectoryPage;