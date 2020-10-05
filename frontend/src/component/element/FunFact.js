import React, { Component } from "react";
import NotificationService from "../standalone/NotificationService";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ConfirmationModal from "../modal/Confirmation";
import FunFactModal from "../modal/edit/FunFact";
import styles from "./funfact.module.scss";
import axios from "../../axios/Axios";

class FunFacts extends Component {
  constructor(props) {
    super(props);
    this.state = { modalConfirmOpen: false, modalOpen: false };
    this.notif = React.createRef();
  }
  transformNumber = (number_param) => {
    try {
      return number_param.replace(/(.)(?=(\d{3})+$)/g, "$1,");
    } catch {
      return "";
    }
  };
  handleDelete = () => {
    axios
      .delete("/api/funfact/" + this.props.data._id)
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
        <FunFactModal
          data={this.props.data}
          value={this.state.modalOpen}
          close={() => this.setState({ modalOpen: false })}
          reload={this.props.reload}
        />
        <div className={styles.root}>
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
          <i className={this.props.data.icon} />
          <h1>{this.props.data.title}</h1>
          <h2>{this.transformNumber(this.props.data.number + "")}</h2>
        </div>
      </React.Fragment>
    );
  }
}
export default FunFacts;
