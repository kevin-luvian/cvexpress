import React, { Component } from "react";
import MainTemplate from "../../template/MainTemplate";
import Grow from "@material-ui/core/Grow";
import Alert from "@material-ui/lab/Alert";
import LoginForm from "../../form/LoginForm";
import setToken from "../../../redux/actions/SetTokenAction";
import setUser from "../../../redux/actions/SetUserAction";
import clearStore from "../../../redux/actions/ClearStoreTempAction";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "../../../axios/Axios";
import styles from "./loginpage.module.scss";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateKey: 0,
      success: false,
      alert: { show: false, severity: "warning", message: "" },
    };
  }
  componentDidMount() {
    this.props.clearStore();
    this.setState({ templateKey: 1 });
  }
  handleLogin = async (payload) => {
    await axios
      .post("/api/auth", payload)
      .then((response) => {
        this.props.setToken(response.data.token);
        this.props.setUser({
          username: response.data.username,
          id: response.data._id,
        });
        this.setState({
          success: true,
          alert: {
            show: true,
            severity: "success",
            message: "login successfull",
          },
        });
      })
      .catch((error) => {
        let message = "error";
        try {
          message = error.response.data.message;
        } finally {
          this.setState({
            alert: {
              show: true,
              severity: "error",
              message: message,
            },
          });
        }
      });
  };
  render() {
    if (this.state.success) return <Redirect to="/" />;
    return (
      <MainTemplate key={this.state.templateKey}>
        <div className={styles.container}>
          <div className="mt-4">
            {this.state.alert.show && (
              <Grow in={this.state.alert.show}>
                <Alert
                  variant="filled"
                  severity={this.state.alert.severity}
                  className={styles.alert}
                  onClose={() => {
                    this.setState({
                      alert: { ...this.state.alert, show: false },
                    });
                  }}
                >
                  {this.state.alert.message}
                </Alert>
              </Grow>
            )}
            <LoginForm handleLogin={this.handleLogin} />
          </div>
        </div>
      </MainTemplate>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  setToken: (payload) => dispatch(setToken(payload)),
  setUser: (payload) => dispatch(setUser(payload)),
  clearStore: () => dispatch(clearStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
