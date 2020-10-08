import React, { Component } from "react";
import styles from "./description.module.scss";
import axios from "../../axios/Axios";
import $ from "jquery";

class Description extends Component {
  constructor(props) {
    super();
    this.state = {
      loadCount: 0,
      professions: [],
      fullname: "",
      quickDescription: "",
      imageData: "",
      cvData: "",
      padding: "0px",
    };
  }
  componentDidMount = () => {
    this.fetchInfo();
    this.fetchDescription();
    this.trackCursor();
    $(window).resize(() => {
      this.calcPadding();
    });
  };
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (this.props.requireLoad) {
      if (
        this.state.loadCount !== prevState.loadCount &&
        this.state.loadCount >= 3
      ) {
        this.props.onLoad();
      }
    }
  };
  trackCursor = () => {
    const width = $(document).width();
    const height = $(document).height();
    $(document).mousemove((event) => {
      $(`.${styles.inner}`).css(
        "background-position",
        `calc(50% + ${this.transform(event.pageX, width, [
          0.8,
          -0.8,
        ])}rem) calc(50% + ${this.transform(event.pageY, height, [
          0.5,
          -0.5,
        ])}rem)`
      );
    });
  };
  calcPadding = () => {
    let res = "0px";
    let diff = 0;
    if (window.innerWidth >= 992) {
      diff =
        $(`.${styles.imageContainer}`).height() -
        $(`.${styles.description}`).height();
    }
    if (diff > 0) res = diff / 2 + "px";
    this.setState({ padding: res });
  };
  fetchInfo = () => {
    axios
      .get("/api/myinfo")
      .then((res) => {
        console.log("User info", res.data);
        this.setState({ fullname: res.data.fullname });

        if (this.props.requireLoad) {
          this.setState({ loadCount: this.state.loadCount + 1 });
        }
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.error;
        } catch {
        } finally {
          console.log("Error", errmsg);
          if (this.props.requireLoad) {
            this.setState({ loadCount: this.state.loadCount + 1 });
          }
        }
      });
  };
  fetchDescription = () => {
    axios
      .get("/api/description")
      .then((res) => {
        console.log("Desc info", res.data);
        this.fetchImageMetadata(res.data.imageID);
        this.fetchCVMetadata(res.data.cvID);
        this.setState({
          professions: res.data.professions.join(", "),
          quickDescription: res.data.quickDescription,
        });

        if (this.props.requireLoad) {
          this.setState({ loadCount: this.state.loadCount + 1 });
        }
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.error;
        } catch {
        } finally {
          console.log("Error", errmsg);
          if (this.props.requireLoad) {
            this.setState({ loadCount: this.state.loadCount + 1 });
          }
        }
      });
  };
  fetchImageMetadata = (id) => {
    axios
      .get("/api/files/" + id)
      .then((res) => {
        console.log("Img Data", res.data);
        this.setState({ imageData: res.data });
        if (this.props.requireLoad) {
          this.setState({ loadCount: this.state.loadCount + 1 });
        }
        this.calcPadding();
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.error;
        } catch {
        } finally {
          console.log("Error", errmsg);
          if (this.props.requireLoad) {
            this.setState({ loadCount: this.state.loadCount + 1 });
          }
        }
      });
  };
  fetchCVMetadata = (id) => {
    axios
      .get("/api/files/" + id)
      .then((res) => {
        console.log("CV Data", res.data);
        this.setState({ cvData: res.data });
      })
      .catch((err) => {
        let errmsg = "error";
        try {
          errmsg = err.response.data.error;
        } catch {
        } finally {
          console.log("Error", errmsg);
        }
      });
  };
  handleDownload = () => {
    if (this.state.cvData) {
      if (["image", "pdf"].some(el => this.state.cvData.contentType.includes(el)))
        window.open(this.state.cvData.url, "_blank");
      else window.open(this.state.cvData.url, "_parent");
    }
  };
  transform = (oldVal, viewPort, range) => {
    //const range = [0.8, -0.8];
    return (oldVal * (range[1] - range[0])) / viewPort + range[0];
  };
  render() {
    return (
      <React.Fragment>
        <div className={styles.root}>
          <div className={styles.imageContainer}>
            <div className={styles.image}>
              <div
                className={styles.inner}
                style={{
                  backgroundImage: `url('${this.state.imageData.url}')`,
                }}
              />
            </div>
          </div>
          <div className={styles.descriptionContainer}>
            <div
              className={styles.description}
              style={{
                paddingTop: this.state.padding,
              }}
            >
              <h1>{this.state.fullname}</h1>
              <p>{this.state.quickDescription}</p>
              <div className={styles.action}>
                <button className={styles.button} onClick={this.handleDownload}>
                  Download CV
                </button>
                <button className={styles.button}>Contact</button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Description;
