import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import Delete from "@material-ui/icons/Delete";
import GetApp from "@material-ui/icons/GetApp";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ModalConfirmation from "../../modal/Confirmation";
import axios from "../../../axios/Axios";
import { randId, toMb } from "../../../service/utils";
import styles from "./fileelement.module.scss";
import $ from "jquery";

class FileElement extends Component {
  constructor(props) {
    super();
    this.state = {
      id: randId(),
      expand: false,
      modalOpen: false,
    };
  }
  componentDidUpdate = (prevProps) => {
    if (this.props.expandID !== prevProps.expandID) {
      if (this.isExpand()) {
        $(`#${this.state.id}`).slideDown();
      } else {
        $(`#${this.state.id}`).slideUp();
      }
    }
  };
  handleDownload = () => {
    if (["image", "pdf"].some(el => this.props.data.contentType.includes(el)))
      window.open(this.props.data.url, "_blank");
    else window.open(this.props.data.url, "_parent");
  };
  handleDelete = () => {
    console.log("Deleting", this.props.data.id)
    axios
      .delete("/api/files/" + this.props.data.id)
      .then(() => {
        this.setState({ modalOpen: false });
        this.props.reload();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  handleExpand = () => {
    if (this.isExpand()) {
      this.props.expand("");
    } else {
      this.props.expand(this.state.id);
    }
  };
  isExpand = () => {
    const expand = this.state.id === this.props.expandID;
    this.setState({ expand: expand });
    return expand;
  };
  render() {
    return (
      <React.Fragment>
        <ModalConfirmation
          title="Delete File"
          message={`Are you sure you want to delete ${this.props.data.originalName} ?`}
          warning="warning: this action cannot be undone."
          value={this.state.modalOpen}
          close={() => this.setState({ modalOpen: false })}
          submit={this.handleDelete}
        />
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={`${styles.title} ${styles.scrollbar}`}>
              <p>{this.props.data.originalName}</p>
            </div>
            <div className={styles.action}>
              <Tooltip title="Download" arrow>
                <div
                  className={`${styles.download} my-auto`}
                  onClick={this.handleDownload}
                >
                  <GetApp />
                </div>
              </Tooltip>
              <Tooltip title="Delete" arrow>
                <div
                  className={`${styles.delete} my-auto`}
                  onClick={() => {
                    this.setState({ modalOpen: true });
                  }}
                >
                  <Delete />
                </div>
              </Tooltip>
              <div
                className={`${styles.expand} my-auto`}
                onClick={this.handleExpand}
              >
                {this.state.expand ? <ExpandLess /> : <ExpandMore />}
              </div>
            </div>
          </div>
          <div
            id={this.state.id}
            className={`${styles.content} ${styles.scrollbar}`}
          >
            {this.props.data.contentType.includes("image") && (
              <div className={styles.image}>
                <img alt="File" src={this.props.data.url} />
              </div>
            )}
            <div className={styles.description}>
              <div>
                <p>Size</p>
                <p>Content-Type</p>
                <p>Upload Date</p>
              </div>
              <Divider
                className={styles.divider}
                orientation="vertical"
                flexItem
              />
              <div>
                <p>{toMb(this.props.data.size)}mb</p>
                <p>{this.props.data.contentType}</p>
                {/*
                <p>{this.props.data.uploadDate.toLocaleDateString()}</p>
                */}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default FileElement;
