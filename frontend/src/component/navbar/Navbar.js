import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import List from "@material-ui/icons/List";
import ArrowDown from "@material-ui/icons/KeyboardArrowDown";
import { randId } from "../../service/utils";
import axios from "../../axios/Axios";
import styles from "./navbar.module.scss";
import $ from "jquery";

const normalLinks = [
  { menu: "Home", url: "/", submenu: [] },
  { menu: "Resume", url: "/resume", submenu: [] },
  { menu: "Login", url: "/login", submenu: [] },
];
const protectedLinks = [
  { menu: "Home", url: "/", submenu: [] },
  { menu: "Resume", url: "/resume", submenu: [] },
  {
    menu: "Config",
    url: "",
    submenu: [
      {
        menu: "Upload",
        url: "/upload",
      },
      {
        menu: "Edit",
        url: "/edit",
      },
      {
        menu: "Edit Resume",
        url: "/edit/resume",
      },
    ],
  },
  { menu: "Logout", url: "/logout", submenu: [] },
];

class Navbar extends Component {
  constructor(props) {
    super();
    this.state = {
      links: [],
      fullName: [""],
      open: false,
    };
  }
  componentDidMount = () => {
    this.fetchInfo();
    this.setLinks();
  };
  setLinks = () => {
    if (this.props.token && this.props.token !== "")
      this.setState({ links: protectedLinks });
    else this.setState({ links: normalLinks });
  };
  slide = () => {
    if (!this.state.open) {
      $(`.${styles.links}`).addClass(styles.linksActive);
    } else {
      $(`.${styles.links}`).removeClass(styles.linksActive);
    }
    this.setState({ open: !this.state.open });
  };
  fetchInfo = () => {
    axios
      .get("/api/myinfo")
      .then((res) => {
        this.setState({ fullName: res.data.fullname.split(" ") });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          console.log("Error", errmsg);
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <nav className={styles.nav}>
          <div className={styles.logoContainer}>
            <div className={styles.logoSymbol}>
              {this.state.fullName[0].charAt(0)}
            </div>
            <div className={styles.logo}>
              {this.state.fullName[0]}{" "}
              <span>
                {this.state.fullName.length > 1 &&
                  this.state.fullName
                    .slice(1, this.state.fullName.length)
                    .join(" ")}
              </span>
            </div>
          </div>
          <div className={styles.links}>
            {this.state.links.map((link, index) => {
              const submenuId = randId();
              return (
                <li key={index}>
                  {link.submenu.length === 0 && (
                    <Link to={link.url}>{link.menu}</Link>
                  )}
                  {link.submenu.length > 0 && (
                    <React.Fragment>
                      <Link to="#">
                        {link.menu}
                        {window.innerWidth > 768 && (
                          <ArrowDown style={{ fontSize: "1.3rem" }} />
                        )}
                      </Link>
                      <ul className={submenuId}>
                        {link.submenu.map((submenu, index) => {
                          return (
                            <li key={index}>
                              <Link to={submenu.url}>{submenu.menu}</Link>
                            </li>
                          );
                        })}
                      </ul>
                    </React.Fragment>
                  )}
                </li>
              );
            })}
          </div>
          <List className={styles.menuIcon} onClick={this.slide} />
        </nav>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Navbar);
