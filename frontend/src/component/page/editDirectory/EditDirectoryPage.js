import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import DirectoryFormEdit from "../../form/edit/DirectoryFormEdit";
import ArrowRight from "@material-ui/icons/ArrowRight";
import styles from "./directorypage.module.scss";
import axios from "../../../axios/Axios";

class EditDirectoryPage extends Component {
  constructor(props) {
    super();
    this.state = {
      files: [],
      mainDirRef: null,
      mainDir: null
    };
    this.notif = null;
  };
  componentDidMount = () => {
    this.fetchFiles();
    this.fetchDirectory();
  };
  addDirRef = element => {
    this.setState({ mainDirRef: element });
  };
  composeDir = () => {
    if (this.state.mainDirRef) {
      const composedDirs = this.state.mainDirRef.compose(true);
      console.log("Composed Dirs Final", composedDirs);
      this.updateDirectory(composedDirs);
    }
  }
  updateMainDir = () => {
    console.log("Try updating main dir");
    if (this.state.mainDirRef) {
      const composedDirs = this.state.mainDirRef.compose();
      console.log("Final Composed", composedDirs);
      this.setState({ mainDir: composedDirs });
    }
  }
  fetchFiles = () => {
    axios
      .get("/api/files")
      .then((res) => {
        console.log("Files", res.data)
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
  fetchDirectory = () => {
    axios
      .get(`/api/directories/${this.props.match.params.slug}`)
      .then((res) => {
        console.log("Directory Data", res.data);
        this.setState({ mainDir: res.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.error+"";
        } catch {
        } finally {
          this.notif.display(errmsg, "danger");
        }
      });
  }
  updateDirectory = data => {
    axios
      .put('/api/directories', data)
      .then((res) => {
        console.log("Updated Directory Data", res.data);
        this.notif.display("Directory data updated", "success");
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
export default EditDirectoryPage;
