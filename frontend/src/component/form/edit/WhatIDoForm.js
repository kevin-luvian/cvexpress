import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import NotificationService from "../../standalone/NotificationService";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import HelpOutline from "@material-ui/icons/HelpOutline";
import ArrowIcon from "@material-ui/icons/ArrowRight";
import IconModal from "../../modal/Icons";
import stylesPrimary from "./whatidoform.module.scss";
import styles from "./editform.module.scss";
import axios from "../../../axios/Axios";

class WhatIDoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      icon: this.props.icon || "",
      title: this.props.title || "",
      description: this.props.description || "",
    };
    this.notif = React.createRef();
  }
  putInfo = () => {
    const data = {
      _id: this.props._id,
      icon: this.state.icon,
      title: this.state.title,
      description: this.state.description,
    };
    axios
      .put("/api/whatido", data)
      .then(() => {
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
  postInfo = () => {
    const data = {
      icon: this.state.icon,
      title: this.state.title,
      description: this.state.description,
    };
    axios
      .post("/api/whatido", data)
      .then(() => {
        this.notif.current.display("what i do data created", "success");
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
  submit = () => {
    if (this.props.isEdit) this.putInfo();
    else this.postInfo();
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <IconModal
          value={this.state.modalOpen}
          close={() => this.setState({ modalOpen: false })}
        />
        <div className={styles.root}>
          <FormControl className={`${styles.input} ${stylesPrimary.icon}`}>
            <InputLabel>Icon</InputLabel>
            <Input
              type="text"
              value={this.state.icon}
              onChange={(e) => {
                this.setState({ icon: e.target.value });
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Tooltip title="Icons" arrow>
                    <HelpOutline
                      className={stylesPrimary.help}
                      onClick={() => {
                        this.setState({ modalOpen: true });
                      }}
                    />
                  </Tooltip>
                </InputAdornment>
              }
            />
          </FormControl>
          <TextField
            className={`${styles.input} ${stylesPrimary.title}`}
            label="Title"
            value={this.state.title}
            onChange={(e) => {
              this.setState({ title: e.target.value });
            }}
          />
          <TextField
            className={`${styles.input} ${styles.description}`}
            label="Description"
            multiline
            rows={2}
            rowsMax={5}
            value={this.state.description}
            onChange={(e) => {
              this.setState({ description: e.target.value });
            }}
          />
          <div className="text-center">
            <button className={styles.button} onClick={this.submit}>
              <p>Submit</p> <ArrowIcon />
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default WhatIDoForm;
