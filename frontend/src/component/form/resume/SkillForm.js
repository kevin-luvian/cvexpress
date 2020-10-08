import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import ArrowIcon from "@material-ui/icons/ArrowRight";
import axios from "../../../axios/Axios";
import stylesPrimary from "./skillform.module.scss";
import styles from "./form.module.scss";

class SkillForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: this.props.category || "",
      title: this.props.title || "",
      percentage: this.props.percentage || 100,
    };
    this.notif = React.createRef();
  }
  componentDidMount = () => { };
  postModel = () => {
    const data = {
      category: this.state.category,
      title: this.state.title,
      percentage: this.state.percentage,
    };
    axios
      .post("/api/skills", data)
      .then(() => {
        this.notif.current.display("Skill data created", "success");
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
    const data = {
      _id: this.props._id,
      category: this.state.category,
      title: this.state.title,
      percentage: this.state.percentage,
    };
    axios
      .put(`/api/skills/${data._id}`, data)
      .then(() => {
        this.notif.current.display("Skill data updated", "normal");
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
  handleBlur = () => {
    if (this.state.percentage < 0) {
      this.setState({ percentage: 0 });
    } else if (this.state.percentage > 100) {
      this.setState({ percentage: 100 });
    }
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
            <TextField
              className={`${styles.input} ${stylesPrimary.categoryInput}`}
              label="Category"
              value={this.state.category}
              onChange={(e) => {
                this.setState({ category: e.target.value });
              }}
            />
            <TextField
              className={`${styles.input} ${stylesPrimary.titleInput}`}
              label="Title"
              value={this.state.title}
              onChange={(e) => {
                this.setState({ title: e.target.value });
              }}
            />
          </div>
          <p className={stylesPrimary.percentageText}>Percentage</p>
          <div className={stylesPrimary.container}>
            <Grid className={stylesPrimary.gridSlider}>
              <Slider
                className={stylesPrimary.slider}
                value={this.state.percentage}
                onChange={(e, newValue) => {
                  this.setState({ percentage: newValue });
                }}
              />
            </Grid>
            <Grid className={stylesPrimary.gridInput}>
              <Input
                className={styles.input}
                value={this.state.percentage}
                margin="dense"
                onChange={(e) => {
                  this.setState({
                    percentage:
                      e.target.value === "" ? "" : Number(e.target.value),
                  });
                }}
                onBlur={this.handleBlur}
                inputProps={{
                  step: 10,
                  min: 0,
                  max: 100,
                  type: "number",
                }}
              />
            </Grid>
          </div>
          <div className="text-center mt-3">
            <button className={styles.button} onClick={this.submit}>
              <p>Submit</p> <ArrowIcon />
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SkillForm;
