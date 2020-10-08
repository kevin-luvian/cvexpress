import React, { Component } from "react";
import { Tooltip, Divider } from "@material-ui/core";
import { Edit, Delete, GetApp, ExpandMore, ExpandLess } from "@material-ui/icons";
import NotificationService from "../../standalone/NotificationService";
import ModalConfirmation from "../../modal/Confirmation";
import ModalFileEdit from "../../modal/edit/FileEdit";
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
      modalDeleteOpen: false,
      modalFileEditOpen: false,
    };
    this.notif = React.createRef();
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
  handleEdit = (input) => {
    console.log("Edit", this.props.data.id)
    const data = {
      _id: this.props._id,
      filename: input.filename,
      contentType: input.contentType
    };
    axios
      .put(`/api/files/${this.props.data.id}`, data)
      .then(() => {
        this.setState({ modalFileEditOpen: false });
        this.props.reload();
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
  handleDelete = () => {
    console.log("Deleting", this.props.data.id)
    axios
      .delete(`/api/files/${this.props.data.id}`)
      .then(() => {
        this.setState({ modalDeleteOpen: false });
        this.props.reload();
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
        <NotificationService ref={this.notif} />
        <ModalConfirmation
          title="Delete File"
          message={`Are you sure you want to delete ${this.props.data.filename} ?`}
          warning="warning: this action cannot be undone."
          value={this.state.modalDeleteOpen}
          close={() => this.setState({ modalDeleteOpen: false })}
          submit={this.handleDelete}
        />
        <ModalFileEdit
          filename={this.props.data.filename}
          contentType={this.props.data.contentType}
          value={this.state.modalFileEditOpen}
          close={() => this.setState({ modalFileEditOpen: false })}
          submit={this.handleEdit}
        />
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={`${styles.title} ${styles.scrollbar}`}>
              <p>{this.props.data.filename}</p>
            </div>
            <div className={styles.action}>
              <Tooltip title="Edit" arrow>
                <div
                  className={`${styles.edit} my-auto`}
                  onClick={() => {
                    this.setState({ modalFileEditOpen: true });
                  }}
                >
                  <Edit />
                </div>
              </Tooltip>
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
                    this.setState({ modalDeleteOpen: true });
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
                <p>{this.props.data.uploadDate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default FileElement;
