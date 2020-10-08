import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import DirectoryForm from "../../form/edit/DirectoryForm";
import ArrowRight from "@material-ui/icons/ArrowRight";
import styles from "./editdirectorypage.module.scss";
import { compose } from "redux";

class EditDirectoryPage extends Component {
  constructor(props) {
    super();
    this.state = {
      directoriesBuilder: [],
      mainDirRef: null
    };
    this.notif = React.createRef();
    this.mainDirRef = null;
  }
  componentDidMount = () => { };
  addDirRef = element => {
    this.setState({ mainDirRef: element });
  };
  composeDir = () => {
    if (this.state.mainDirRef) {
      const composedDirs = this.state.mainDirRef.compose();
    }
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
        <NotificationService ref={this.notif} />
        <div className={`${styles.root} col-12 col-md-10 mx-auto`}>
          <DirectoryForm ref={this.addDirRef} allFiles={allFile} />
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
