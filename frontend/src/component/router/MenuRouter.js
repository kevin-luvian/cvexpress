import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import HomePage from "../page/home/HomePage";
import ResumePage from "../page/resume/ResumePage";
import UploadPage from "../page/upload/UploadPage";
import EditPage from "../page/edit/EditPage";
import EditResumePage from "../page/editResume/EditResumePage";
import EditDirectoryPage from "../page/editDirectory/EditDirectoryPage";
import LoginPage from "../page/login/LoginPage";
import Error404Page from "../page/error/Error404Page";
import clearStore from "../../redux/actions/ClearStoreTempAction";
import { Redirect } from "react-router-dom";
import axios from "../../axios/Axios";
import MainTemplate from "../template/MainTemplate";

class MenuRouter extends Component {
  constructor(props) {
    super();
    this.state = {};
  }
  checkAuth = async () => {
    return await axios
      .get("/api/auth/check")
      .then(() => {
        return true;
      })
      .catch((error) => {
        console.log(error.response);
        this.props.clearStore();
        return false;
      });
  };
  auth = () => {
    return this.checkAuth() && this.props.token.length > 0;
  };
  render() {
    const ProtectedRoute = ({ component: Component, ...rest }) => (
      <MainTemplate>
        <Route
          {...rest}
          render={(props) =>
            this.auth() ? <Component {...props} /> : <Error404Page />
          }
        />
      </MainTemplate>
    );
    const NavRoute = ({ component: Component, ...rest }) => (
      <MainTemplate>
        <Route {...rest} render={(props) => <Component {...props} />} />
      </MainTemplate>
    );
    return (
      <Router>
        <Switch>
          <NavRoute path="/" exact component={HomePage} />
          <NavRoute path="/resume" component={ResumePage} />
          <ProtectedRoute path="/upload" component={UploadPage} />
          <ProtectedRoute path="/edit" exact component={EditPage} />
          <ProtectedRoute path="/edit/resume" component={EditResumePage} />
          <NavRoute path="/edit/directory" component={EditDirectoryPage} />
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect from="/logout" to="/login" />
          <NavRoute component={Error404Page} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  clearStore: () => dispatch(clearStore()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuRouter);
