import React, { Component } from "react";
import FunFactElement from "../element/FunFact";
import styles from "./contents.module.scss";
import stylesPrimary from "./funfacts.module.scss";
import axios from "../../axios/Axios";

class FunFacts extends Component {
  constructor(props) {
    super();
    this.state = { funFacts: [] };
  }
  componentDidMount = () => {
    this.fetchFunFact();
  };
  fetchFunFact = () => {
    axios
      .get("/api/quickinfos/funfact")
      .then((res) => {
        console.log("Funfact Info", res.data);
        this.setState({ funFacts: res.data });
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
            <p>Fun Facts</p>
            <div className={styles.line}>
              <div />
              <div />
            </div>
          </div>
          <div className={stylesPrimary.elements}>
            {this.state.funFacts.map((info, i) => {
              return <FunFactElement key={i} data={info} />;
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default FunFacts;
