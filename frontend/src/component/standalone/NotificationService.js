import React, { Component } from "react";
import NotificationBox from "./NotificationBox";
import NotificationElement from "./Notification";

class NotificationService extends Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [], closedCount: 0 };
  }
  componentDidUpdate = () => {
    const notifLength = this.state.notifications.length;
    const closedLength = this.state.closedCount;
    if (closedLength > 0 && notifLength === closedLength) {
      this.delete();
    }
  };
  display = (message, type) => {
    let newNotif = { type: type, message: message };
    console.log("display", newNotif);
    this.setState({ notifications: [...this.state.notifications, newNotif] });
  };
  remove = () => {
    setTimeout(() => {
      this.setState({
        closedCount: this.state.closedCount + 1,
      });
    }, 3000);
  };
  delete = () => {
    console.log("Removing Notif...");
    this.setState({ notifications: [], closedCount: 0 });
  };
  render() {
    return (
      <React.Fragment>
        <NotificationBox>
          {this.state.notifications.map((element, i) => {
            return (
              <NotificationElement
                key={i}
                type={element.type}
                message={element.message}
                close={this.remove}
              />
            );
          })}
        </NotificationBox>
      </React.Fragment>
    );
  }
}

export default NotificationService;
