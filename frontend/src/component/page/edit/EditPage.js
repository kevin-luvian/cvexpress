import React, { Component } from "react";
import Divider from "@material-ui/core/Divider";
import WhatIDoElement from "../../element/WhatIDo";
import FunFactElement from "../../element/FunFact";
import FunFactForm from "../../form/edit/FunFactForm";
import WhatIDoForm from "../../form/edit/WhatIDoForm";
import DescriptionForm from "../../form/edit/DescriptionForm";
import BioForm from "../../form/edit/BioForm";
import styles from "./editpage.module.scss";
import axios from "../../../axios/Axios";

class EditPage extends Component {
  constructor(props) {
    super();
    this.state = {
      whatIDos: [],
      funFacts: [],
    };
  }
  componentDidMount = () => {
    this.fetchWhatIDo();
    this.fetchFunFact();
  };
  fetchWhatIDo = () => {
    axios
      .get("/api/quickinfos/whatido")
      .then((res) => {
        console.log("Wido Info", res.data);
        this.setState({ whatIDos: res.data });
      })
      .catch((err) => {
        console.log("Error", err.response);
      });
  };
  fetchFunFact = () => {
    axios
      .get("/api/quickinfos/funfact")
      .then((res) => {
        console.log("Funfact Info", res.data);
        this.setState({ funFacts: res.data });
      })
      .catch((err) => {
        console.log("Error", err.response);
      });
  };
  render() {
    return (
      <React.Fragment>
        <div className={`${styles.root} col-12 col-md-10 mx-auto`}>
          <div className={styles.container}>
            <div className={styles.header}>Bio</div>
            <div className={styles.inputContainer}>
              <BioForm />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.header}>Description</div>
            <div className={styles.inputContainer}>
              <DescriptionForm />
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.header}>What I Do</div>
            <div className={styles.inputContainer}>
              <WhatIDoForm reload={this.fetchWhatIDo} />
            </div>
            {this.state.whatIDos.length > 0 && (
              <Divider className={styles.divider} />
            )}
            {this.state.whatIDos.map((info, i) => {
              return (
                <div className="mt-4" key={i}>
                  <WhatIDoElement
                    edit={true}
                    data={info}
                    reload={this.fetchWhatIDo}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.container}>
            <div className={styles.header}>Fun Facts</div>
            <div className={styles.inputContainer}>
              <FunFactForm reload={this.fetchFunFact} />
            </div>
            {this.state.funFacts.length > 0 && (
              <Divider className={styles.divider} />
            )}
            <div className={styles.elements}>
              {this.state.funFacts.map((info, i) => {
                return (
                  <FunFactElement
                    edit={true}
                    key={i}
                    data={info}
                    reload={this.fetchFunFact}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditPage;
