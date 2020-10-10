import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import DirectoryForm from "../../form/edit/DirectoryForm";
import ArrowRight from "@material-ui/icons/ArrowRight";
import styles from "./editdirectorypage.module.scss";
import axios from "../../../axios/Axios";
import { compose } from "redux";

class EditDirectoryPage extends Component {
  constructor(props) {
    super();
    this.state = {
      directoriesBuilder: [],
      files: [],
      mainDirRef: null
    };
    this.notif = null;
    this.mainDirRef = null;
  }
  componentDidMount = () => {
    this.fetchFiles();
  };
  addDirRef = element => {
    this.setState({ mainDirRef: element });
  };
  composeDir = () => {
    if (this.state.mainDirRef) {
      const composedDirs = this.state.mainDirRef.compose();
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
  render() {
    const allFile = [
      { title: "lolololashashkvbzxkjbvilwq2y1 vqo e  qwe qkjas gkg kags kgkfg", size: 75 },
      { title: "a", size: 50 },
      { title: "b", size: 60 },
      { title: "c", size: 90 },
    ]
    return (
      <React.Fragment>
        <NotificationService
          ref={(element) => {
            if (element !== null) this.notif = element;
          }}
        />
        <div className={`${styles.root} col-12 col-md-10 mx-auto`}>
          <DirectoryForm ref={this.addDirRef} allFiles={this.state.files} />
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
