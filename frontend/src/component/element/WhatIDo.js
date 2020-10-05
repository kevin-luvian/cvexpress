import React, { Component } from "react";
import NotificationService from "../standalone/NotificationService";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import WhatIDoModal from "../modal/edit/WhatIDo";
import ConfirmationModal from "../modal/Confirmation";
import styles from "./whatido.module.scss";
import axios from "../../axios/Axios";

class WhatIDo extends Component {
  constructor(props) {
    super(props);
    this.state = { modalConfirmOpen: false, modalOpen: false };
    this.notif = React.createRef();
  }
  deleteInfo = () => {
    axios
      .delete("/api/whatido/" + this.props.data._id)
      .then(() => {
        this.setState({ modalConfirmOpen: false });
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
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <ConfirmationModal
          title="Delete What I Do"
          message={`Are you sure you want to delete ${this.props.data.title} ?`}
          warning="warning: this action cannot be undone."
          value={this.state.modalConfirmOpen}
          close={() => this.setState({ modalConfirmOpen: false })}
          submit={this.deleteInfo}
        />
        <WhatIDoModal
          data={this.props.data}
          value={this.state.modalOpen}
          close={() => this.setState({ modalOpen: false })}
          reload={this.props.reload}
        />
        <div className={styles.root}>
          <div className={styles.icon}>
            <i className={this.props.data.icon} />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1>{this.props.data.title}</h1>
              {this.props.edit && (
                <React.Fragment>
                  <Tooltip title="Edit" arrow>
                    <EditIcon
                      className={styles.edit}
                      onClick={() => {
                        this.setState({ modalOpen: true });
                      }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <DeleteIcon
                      className={styles.delete}
                      onClick={() => {
                        this.setState({ modalConfirmOpen: true });
                      }}
                    />
                  </Tooltip>
                </React.Fragment>
              )}
            </div>
            <p>{this.props.data.description}</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default WhatIDo;
