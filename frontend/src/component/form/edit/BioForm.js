import React, { Component } from "react";
import NotificationService from "../../standalone/NotificationService";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import ArrowIcon from "@material-ui/icons/ArrowRight";
import styles from "./editform.module.scss";
import axios from "../../../axios/Axios";

class DescriptionForm extends Component {
  constructor(props) {
    super();
    this.state = {
      fullname: "",
      address: "",
      gender: "",
      phoneNumber: "",
      email: "",
    };
    this.notif = React.createRef();
  }
  componentDidMount = () => {
    this.fetchUserInfo();
  };
  changePhoneNumber = (e) => {
    const input_param = e.target.value;
    const regex = new RegExp("^[0-9]+$");
    if (regex.test(input_param) && input_param.length <= 12) {
      this.setState({ phoneNumber: input_param });
    }
  };
  fetchUserInfo = () => {
    axios
      .get("/api/myinfo")
      .then((response) => {
        const userInfo = response.data;
        console.log("User Info", userInfo);
        if (userInfo.length > 0) {
          this.setState({
            fullname: userInfo[0].fullName,
            email: userInfo[0].email,
            phoneNumber: userInfo[0].phoneNumber,
            address: userInfo[0].address,
            gender: userInfo[0].gender,
          });
        }
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
  postUserInfo = () => {
    const data = {
      fullName: this.state.fullname,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      address: this.state.address,
      gender: this.state.gender,
    };
    axios
      .post("/api/myinfo", data)
      .then(() => {
        this.notif.current.display("user data updated", "success");
        this.fetchUserInfo();
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
    const genderOption = [
      { value: true, display: "male" },
      { value: false, display: "female" },
    ];
    return (
      <React.Fragment>
        <NotificationService ref={this.notif} />
        <div className={styles.root}>
          <TextField
            className={styles.input}
            label="Fullname"
            value={this.state.fullname}
            onChange={(e) => {
              this.setState({ fullname: e.target.value });
            }}
          />
          <TextField
            className={styles.input}
            label="Email"
            value={this.state.email}
            onChange={(e) => {
              this.setState({ email: e.target.value });
            }}
          />
          <TextField
            className={styles.input}
            label="Phone Number"
            value={this.state.phoneNumber}
            onChange={this.changePhoneNumber}
          />
          <TextField
            className={styles.input}
            label="Address"
            multiline
            rows={2}
            rowsMax={5}
            value={this.state.address}
            onChange={(e) => {
              this.setState({ address: e.target.value });
            }}
          />
          <TextField
            select
            label="Select Gender"
            className={styles.input}
            value={this.state.gender}
            onChange={(e) => {
              this.setState({ gender: e.target.value });
            }}
          >
            {genderOption.map((option) => (
              <MenuItem key={option.display} value={option.value}>
                {option.display}
              </MenuItem>
            ))}
          </TextField>
          <div className="text-center">
            <button className={styles.button} onClick={this.postUserInfo}>
              <p>Submit</p> <ArrowIcon />
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DescriptionForm;
