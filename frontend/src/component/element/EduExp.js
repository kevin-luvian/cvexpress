import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import NotificationService from "../standalone/NotificationService";
import ConfirmationModal from "../modal/Confirmation";
import EduExpModal from "../modal/edit/EduExpModal";
import { randId } from "../../service/utils";
import axios from "../../axios/Axios";
import styles from "./eduexp.module.scss";
import $ from "jquery";

class EduExp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      generatedId: randId(),
      modalConfirmOpen: false,
      modalOpen: false,
      rootHeight: "",
      rootWidth: "",
    };
    this.notif = React.createRef();
  }
  componentDidMount = () => {
    $(`.${styles.root}`).resize(() => {
      this.setSize();
    });
  };
  setSize = () => {
    this.setState({
      rootHeight: $(`#${this.state.generatedId}`).height() + "px",
      rootWidth: $(`#${this.state.generatedId}`).width() + "px",
    });
  };
  handleDelete = () => {
    axios
      .delete(`/api/resumes/${this.props.data._id}`)
      .then(() => {
        this.notif.current.display(
          this.props.data.title + " data deleted",
          "normal"
        );
        this.setState({ modalConfirmOpen: false });
        this.props.reload();
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          console.log("Error", errmsg);
          this.notif.current.display(errmsg, "danger");
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <ConfirmationModal
          title={
            "Delete " + (this.props.data.type ? "Education" : "Experience")
          }
          message={`Are you sure you want to delete ${this.props.data.title} ?`}
          warning="warning: this action cannot be undone."
          value={this.state.modalConfirmOpen}
          close={() => this.setState({ modalConfirmOpen: false })}
          submit={this.handleDelete}
        />
        <EduExpModal
          data={this.props.data}
          value={this.state.modalOpen}
          close={() => this.setState({ modalOpen: false })}
          reload={this.props.reload}
        />
        <div id={this.state.generatedId} className={styles.root}>
          <div className={styles.lines}>
            <div style={{ height: this.state.rootHeight }} />
            <div
              style={{
                marginTop: this.state.rootHeight,
                width: `calc(${this.state.rootWidth} - 1rem)`,
              }}
            />
          </div>
          <div className={styles.container}>
            <div className={styles.upper}>
              <p className={styles.period}>{this.props.data.period}</p>
              <p className={styles.snippet}>{this.props.data.snippet}</p>
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
            </div>
            <div className={styles.content}>
              <h1>{this.props.data.title}</h1>
              <p>{this.props.data.description}</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default EduExp;
