import React, { Component } from "react";
import NotificationService from "../standalone/NotificationService";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmationModal from "../modal/Confirmation";
import SkillModal from "../modal/edit/Skills";
import styles from "./skill.module.scss";
import axios from "../../axios/Axios";

class Skill extends Component {
  constructor(props) {
    super();
    this.state = { modalConfirmOpen: false, modalOpen: false };
    this.notif = React.createRef();
  }
  handleDelete = () => {
    axios
      .delete("/api/skills/" + this.props.data._id)
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
          title="Delete Fun Fact"
          message={`Are you sure you want to delete ${this.props.data.title} ?`}
          warning="warning: this action cannot be undone."
          value={this.state.modalConfirmOpen}
          close={() => this.setState({ modalConfirmOpen: false })}
          submit={this.handleDelete}
        />
        <SkillModal
          data={this.props.data}
          value={this.state.modalOpen}
          close={() => this.setState({ modalOpen: false })}
          reload={this.props.reload}
        />
        <div className={styles.root}>
          <div className={styles.header}>
            <h1>{this.props.data.title}</h1>
            {this.props.edit && (
              <div className={styles.action}>
                <Tooltip title="Edit" arrow>
                  <EditIcon
                    onClick={() => {
                      this.setState({ modalOpen: true });
                    }}
                  />
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <DeleteIcon
                    onClick={() => {
                      this.setState({ modalConfirmOpen: true });
                    }}
                  />
                </Tooltip>
              </div>
            )}
            <p>{this.props.data.percentage}%</p>
          </div>
          <div className={styles.percentage}>
            <div style={{ width: this.props.data.percentage + "%" }} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Skill;
