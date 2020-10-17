import React, { Component } from "react";
import { connect } from "react-redux";
import PuffLoader from "react-spinners/PuffLoader";
import DirectoryElement from "../../element/Directory";
import { randId } from "../../../service/utils";
import axios from "../../../axios/Axios";
import styles from "./directoriespage.module.scss";

class DirectoriesPage extends Component {
    constructor(props) {
        super();
        this.state = {
            loading: true,
            directories: []
        };
    }
    componentDidMount = () => {
        this.fetchDirectories();
    }
    fetchDirectories = () => {
        axios
            .get("/api/directories")
            .then((res) => {
                console.log("Directories Data", res.data);
                this.setState({
                    loading: false,
                    directories: res.data
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
                    className={`${styles.root} col-12 col-md-10 mx-auto ${this.state.loading ? "d-none" : "d-block"}`}
                >
                    <div className="row">
                        {this.state.directories.map((directory, index) => (
                            <div
                                key={index}
                                className="col-12 col-sm-6 col-lg-4 mb-3">
                                <DirectoryElement
                                    edit={this.props.token.length > 0}
                                    reload={this.fetchDirectories}
                                    directory={directory} />
                            </div>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => ({
    ...state,
});
export default connect(mapStateToProps)(DirectoriesPage);
