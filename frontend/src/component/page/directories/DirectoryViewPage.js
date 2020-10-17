import React, { Component } from "react";
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import PuffLoader from "react-spinners/PuffLoader";
import axios from "../../../axios/Axios";
import styles from "./directoryviewpage.module.scss";
import $ from "jquery";

class DirectoriesPage extends Component {
    constructor(props) {
        super();
        this.state = {
            loading: true,
            navopen: false,
            directory: {}
        };
    }
    componentDidMount = () => {
        this.fetchDirectory();
    }
    fetchDirectory = () => {
        axios
            .get(`/api/directories/${this.props.match.params.slug}`)
            .then((res) => {
                console.log("Directory Data", res.data);
                this.setState({
                    loading: false,
                    directory: res.data
                });
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
    }
    renderNav = (obj, index, paddingleft) => {
        return (
            <li key={index} className={styles.navlist}>
                <p style={{ paddingLeft: `${paddingleft}px` }}>{obj.title}</p>
                {obj.sections.length > 0 &&
                    <ul className={styles.navulist}>
                        {obj.sections.map((item, index) => (
                            this.renderNav(item, index, paddingleft + 15)
                        ))}
                    </ul>
                }
            </li>
        )
    }
    handleUpClick = () => {
        if (!this.state.navopen) {
            let height = $(`.${styles.navigation}`).height();
            height = height < window.innerHeight / 2 ? height : window.innerHeight / 2 + 70;
            $(`.${styles.navigation}`).css("transform", `translateY(calc(100vh - ${height}px))`);
        } else {
            $(`.${styles.navigation}`).css("transform", `translateY(calc(100vh - 55px))`);
        }
        this.setState({ navopen: !this.state.navopen })
    }
    render() {
        return (
            <React.Fragment>
                {this.state.loading && (
                    <div className={styles.loader}>
                        <PuffLoader loading={true} />
                        <div className={styles.fill} />
                    </div>
                )}
                <div
                    className={`${styles.root} mx-auto ${this.state.loading ? "d-none" : "d-block"}`}
                >
                    <div className="row px-3">
                        <div className={`${styles.navigation} col-12 col-md-4 col-lg-3`}>
                            <button
                                className={styles.viewMoreButton}
                                onClick={this.handleUpClick}>
                                {this.state.navopen ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
                            </button>
                            <div
                                className={styles.navcontainer}
                                style={{ maxHeight: `${window.innerHeight / 2}px` }}>
                                <ul className={styles.navulist}>
                                    {this.state.directory.sections &&
                                        this.state.directory.sections.map((item, index) => (
                                            this.renderNav(item, index, 15)
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="col bg-primary">
                            <p>blue</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default DirectoriesPage;
