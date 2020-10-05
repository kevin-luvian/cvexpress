import React, { Component } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { CSSTransition } from "react-transition-group";
import styles from "./notification.module.scss";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      rootColor: "#2196f3",
    };
  }
  componentDidMount = () => {
    this.selectTheme();
    this.timeout();
  };
  selectTheme = () => {
    const type = this.props.type;
    let rootColor = this.state.rootColor;
    if (type === "success") {
      rootColor = "#4caf50";
    } else if (type === "danger") {
      rootColor = "#f44336";
    }
    this.setState({
      rootColor: rootColor,
    });
  };
  timeout = () => {
    setTimeout(() => {
      this.close();
    }, 3000);
  };
  close = () => {
    this.setState({ open: false });
    this.props.close();
  };
  render() {
    return (
      <React.Fragment>
        <CSSTransition
          classNames="notif-animation"
          in={this.state.open}
          timeout={300}
          appear
        >
          <div className="notif-animation">
            <div
              className={styles.root}
              style={{
                backgroundColor: this.state.rootColor,
              }}
            >
              <div className={styles.message}>
                <p>{this.props.message}</p>
              </div>
              <CloseIcon className={styles.button} onClick={this.close} />
            </div>
          </div>
        </CSSTransition>
      </React.Fragment>
    );
  }
}

export default Notification;
