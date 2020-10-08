import React, { Component } from "react";
import WhatIDoElement from "../element/WhatIDo";
import styles from "./contents.module.scss";
import stylesPrimary from "./whatido.module.scss";
import axios from "../../axios/Axios";

class WhatIDo extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
    };
  }
  componentDidMount = () => {
    this.fetchData();
  };
  fetchData = () => {
    axios
      .get("/api/quickinfos/whatido")
      .then((res) => {
        console.log("WhatIDo Info", res.data);
        this.setState({ data: res.data });
        if (this.props.requireLoad) {
          this.props.onLoad();
        }
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.message;
        } catch {
        } finally {
          console.log("Error", errmsg);
          if (this.props.requireLoad) {
            this.props.onLoad();
          }
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <div className={styles.root}>
          <div className={styles.title}>
            <p>What I Do</p>
            <div className={styles.line}>
              <div />
              <div />
            </div>
          </div>
          <div className={styles.elementContainer}>
            {this.state.data.map((data, i) => {
              return (
                <div key={i} className={stylesPrimary.element}>
                  <WhatIDoElement data={data} />
                </div>
              );
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default WhatIDo;
