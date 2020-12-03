import React, { Component } from "react";
import UploadForm from "../../form/UploadForm";
import TableFile from "../../table/TableFile";
import styles from "./upload.module.scss";

class UploadPage extends Component {
  constructor(props) {
    super();
    this.table = React.createRef();
  }
  handleReload = () => {
    this.table.current.fetchFiles();
  };
  render() {
    return (
      <div className={`${styles.root} col-12 col-md-10 mx-auto`}>
        <UploadForm reload={this.handleReload} />
        <div className="mt-3">
          <TableFile ref={this.table} />
        </div>
      </div>
    );
  }
}
export default UploadPage;
