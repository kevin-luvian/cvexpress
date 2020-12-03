import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import IconData from "./data/Favicon";
import styles from "./icons.module.scss";
import $ from "jquery";

class Icons extends Component {
  constructor(props) {
    super(props);
    this.state = { search: "", allIcon: [], searchIcon: [], typingTimeout: 0 };
  }
  componentDidMount = () => {
    this.renderIcons();
  };
  handleSearch = (search_param) => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      search: search_param,
      typingTimeout: setTimeout(() => {
        this.renderSearch(search_param);
      }, 700),
    });
  };
  renderSearch = () => {
    const search_param = this.state.search;
    let res = [];
    let counter = 0;
    if (search_param !== "") {
      for (let i = 1; i < IconData.length; i++) {
        for (let j = 0; j < IconData[i].icons.length; j++) {
          if (IconData[i].icons[j].text.includes(search_param))
            res.push(this.renderIcon(IconData[i].icons[j], counter++));
        }
      }
    }
    this.setState({ searchIcon: res });
  };
  renderIcons = () => {
    const res = [];
    for (let i = 0; i < IconData.length; i++) {
      res.push(
        <div key={i} className={styles.iconCard}>
          <div className={styles.iconBody}>
            <h4 className={styles.headerTitle}> {IconData[i].title} </h4>
            <div className={styles.content}>
              {IconData[i].icons.map((icon, index) => {
                return this.renderIcon(icon, index);
              })}
            </div>
          </div>
        </div>
      );
      this.setState({ allIcon: res });
    }
  };
  renderIcon = (icon, index) => {
    return (
      <div key={index} className={styles.item}>
        <p>
          <i className={icon.value} />
          {icon.text}
        </p>
      </div>
    );
  };
  render() {
    return (
      <Dialog
        open={this.props.value}
        onClose={this.props.close}
        fullWidth={true}
        maxWidth="lg"
      >
        <div className={`${styles.container} ${styles.scrollbar}`}>
          <div className={styles.title}>
            <h4>Fav Icons</h4>
          </div>
          <Paper className={styles.searchbar}>
            <div
              className={styles.searchIcon}
              onClick={() => {
                $(`.${styles.input} input`).focus();
              }}
            >
              <SearchIcon />
            </div>
            <Divider className={styles.divider} orientation="vertical" />
            <InputBase
              className={styles.input}
              placeholder="Search"
              value={this.state.search}
              onChange={(e) => {
                this.handleSearch(e.target.value.toLowerCase());
              }}
            />
          </Paper>
          <div className={styles.content}>{this.state.searchIcon}</div>
          {this.state.allIcon}
        </div>
      </Dialog>
    );
  }
}

export default Icons;
