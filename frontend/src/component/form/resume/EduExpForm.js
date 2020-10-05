import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import ArrowIcon from "@material-ui/icons/ArrowRight";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import styles from "./form.module.scss";
import stylesPrimary from "./eduexpform.module.scss";
import axios from "../../../axios/Axios";

class EduExpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: [],
      selectedYear: this.props.year || "",
      selectedYearEnd: this.props.yearEnd || "",
      smallDesc: this.props.smallDesc || "",
      title: this.props.title || "",
      description: this.props.description || "",
    };
    this.notif = React.createRef();
  }
  componentDidMount = () => {
    this.generateOption();
  };
  postModel = () => {
    const year =
      this.state.selectedYear +
      (this.state.selectedYearEnd ? " - " + this.state.selectedYearEnd : "");
    const data = {
      type: this.props.isEdu ? true : false,
      year: year,
      smallDesc: this.state.smallDesc,
      title: this.state.title,
      description: this.state.description,
    };
    axios
      .post("/api/eduExp", data)
      .then(() => {
        this.notif.current.display(
          (this.props.isEdu ? "Education" : "Experience") + " data created",
          "success"
        );
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
  putModel = () => {
    const year =
      this.state.selectedYear +
      (this.state.selectedYearEnd ? " - " + this.state.selectedYearEnd : "");
    const data = {
      _id: this.props._id,
      type: this.props.type,
      year: year,
      smallDesc: this.state.smallDesc,
      title: this.state.title,
      description: this.state.description,
    };
    axios
      .put("/api/eduExp", data)
      .then(() => {
        this.notif.current.display(
          (this.props.isEdu ? "Education" : "Experience") + " data updated",
          "success"
        );
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
  generateOption = () => {
    const current_year = new Date().getFullYear();
    const start_year = 1990;
    let res = ["", "Current"];
    for (let i = current_year; i >= start_year; i--) {
      res.push(i.toString());
    }
    this.setState({ option: res });
  };
  submit = () => {
    if (this.props.isEdit) this.putModel();
    else this.postModel();
  };
  render() {
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <div className={styles.root}>
          <div className={stylesPrimary.container}>
            <Autocomplete
              className={`${styles.input} ${stylesPrimary.year}`}
              options={this.state.option}
              value={this.state.selectedYear}
              onChange={(event, newValue) => {
                this.setState({ selectedYear: newValue });
              }}
              renderInput={(params) => <TextField {...params} label="Year" />}
            />
            <p>-</p>
            <Autocomplete
              className={`${styles.input} ${stylesPrimary.year}`}
              options={this.state.option}
              value={this.state.selectedYearEnd}
              onChange={(event, newValue) => {
                this.setState({ selectedYearEnd: newValue });
              }}
              renderInput={(params) => <TextField {...params} label="Year" />}
            />
            <TextField
              className={`${styles.input} ${stylesPrimary.smallDesc}`}
              label="Small Description"
              value={this.state.smallDesc}
              onChange={(e) => {
                this.setState({ smallDesc: e.target.value });
              }}
            />
            <TextField
              className={`${styles.input} ${stylesPrimary.title}`}
              label="Title"
              value={this.state.title}
              onChange={(e) => {
                this.setState({ title: e.target.value });
              }}
            />
          </div>
          <TextField
            className={styles.input}
            multiline
            rows={2}
            rowsMax={5}
            label="Description"
            value={this.state.description}
            onChange={(e) => {
              this.setState({ description: e.target.value });
            }}
          />
          <button className={styles.button} onClick={this.submit}>
            <p>Submit</p> <ArrowIcon />
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EduExpForm;
