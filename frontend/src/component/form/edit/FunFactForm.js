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
import stylesPrimary from "./funfactform.module.scss";
import styles from "./editform.module.scss";
import axios from "../../../axios/Axios";

class WhatIDoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      icon: this.props.icon || "",
      title: this.props.title || "",
      number: this.props.number || 0,
    };
    this.notif = React.createRef();
  }
  putModel = () => {
    const data = {
      _id: this.props._id,
      icon: this.state.icon,
      title: this.state.title,
      number: this.state.number,
    };
    axios
      .put("/api/funfact", data)
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
  postModel = () => {
    const data = {
      icon: this.state.icon,
      title: this.state.title,
      number: this.state.number,
    };
    axios
      .post("/api/funfact", data)
      .then(() => {
        this.notif.current.display("fun fact data created", "success");
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
    if (this.props.isEdit) this.putModel();
    else this.postModel();
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
            className={`${styles.input} ${stylesPrimary.number}`}
            label="Number"
            type="number"
            value={this.state.number}
            onChange={(e) => {
              this.setState({ number: e.target.value });
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
