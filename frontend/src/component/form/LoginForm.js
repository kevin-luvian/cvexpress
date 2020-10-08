import React, { Component } from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import PersonOutlineRoundedIcon from "@material-ui/icons/PersonOutlineRounded";
import LockOpenRoundedIcon from "@material-ui/icons/LockOpenRounded";
import Button from "@material-ui/core/Button";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import styles from "./loginform.module.scss";

class LoginForm extends Component {
  constructor(props) {
    super();
    this.state = {
      open: false,
      username: "",
      password: "",
      showPassword: false,
    };
  }
  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };
  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };
  handleShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };
  handleLogin = () => {
    this.props.handleLogin({
      username: this.state.username,
      password: this.state.password,
    });
  };
  render() {
    return (
      <div className={styles.rootContainer}>
        <div className={styles.margin}>
          <div className={styles.inputContainer}>
            <PersonOutlineRoundedIcon className={styles.icon} />
            <TextField
              className={styles.field}
              label="Username"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </div>
        </div>
        <div className={styles.margin}>
          <div className={styles.inputContainer}>
            <LockOpenRoundedIcon className={styles.icon} />
            <FormControl className={`${styles.margin} ${styles.field}`}>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                type={this.state.showPassword ? "text" : "password"}
                value={this.state.password}
                onChange={this.handlePasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={this.handleShowPassword}
                    >
                      {this.state.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
        </div>
        <div className="text-center">
          <Button
            className={`mt-3 ${styles.submitButton}`}
            onClick={this.handleLogin}
          >
            <p>login</p>
            <ExitToAppRoundedIcon />
          </Button>
        </div>
      </div>
    );
  }
}
export default LoginForm;
