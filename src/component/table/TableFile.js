import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import { Search, FilterList } from "@material-ui/icons";
import FileElement from "./element/FileElement";
import axios from "../../axios/Axios";
import styles from "./tablefile.module.scss";
import $ from "jquery";

class TableFile extends Component {
  constructor(props) {
    super();
    this.state = {
      files: [],
      displayFiles: [],
      search: "",
      expandID: "",
    };
  }
  componentDidMount = () => {
    this.fetchFiles();
  };
  fetchFiles = () => {
    axios
      .get("/api/files")
      .then((res) => {
        console.log("Raw Files", res.data);
        const files = this.parseAPI(res.data);
        console.log("Files", files);
        this.setState({ files: files }, () => {
          this.handleSearch(this.state.search);
        });
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  parseAPI = (files) => {
    const res = [];
    for (let i = 0; i < files.length; i++) {
      let fileID = files[i]._id;
      let filename = files[i].filename;
      let size = files[i].size;
      let uploadDate = new Date(files[i].uploadDate);
      let contentType = files[i].contentType;
      let url = files[i].url;
      res.push({
        filename: filename,
        id: fileID,
        size: size,
        uploadDate: uploadDate,
        contentType: contentType,
        url: url,
      });
    }
    return res;
  };
  handleSearch = (search_param) => {
    const res = [];
    this.state.files.forEach((file, i) => {
      let fileName = file.filename.toLowerCase();
      if (fileName.includes(search_param.toLowerCase())) res.push(file);
    });
    this.setState({ search: search_param, displayFiles: res });
  };
  render() {
    return (
      <React.Fragment>
        <Paper className={styles.searchbar}>
          <div
            className={styles.searchIcon}
            onClick={() => {
              console.log("focus!");
              $(`.${styles.input} input`).focus();
            }}
          >
            <Search />
          </div>
          <Divider className={styles.divider} orientation="vertical" />
          <InputBase
            className={styles.input}
            placeholder="Search File"
            value={this.state.search}
            onChange={(e) => {
              this.handleSearch(e.target.value);
            }}
          />
          <Divider className={styles.divider} orientation="vertical" />
          <IconButton className={styles.filter}>
            <FilterList />
          </IconButton>
        </Paper>
        {this.state.displayFiles.map((file, i) => {
          return (
            <FileElement
              key={i}
              data={file}
              expandID={this.state.expandID}
              expand={(id) => {
                this.setState({ expandID: id });
              }}
              reload={this.fetchFiles}
            />
          );
        })}
      </React.Fragment>
    );
  }
}
export default TableFile;
