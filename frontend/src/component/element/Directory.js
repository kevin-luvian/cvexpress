import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    IconButton,
    Typography,
    ClickAwayListener
} from '@material-ui/core';
import {
    ExpandMore,
    MoreVert
} from '@material-ui/icons';
import NotificationService from "../standalone/NotificationService";
import ConfirmationModal from "../modal/Confirmation";
import { randId } from "../../service/utils"
import styles from "./directory.module.scss";
import axios from "../../axios/Axios";
import $ from "jquery";

class Directory extends Component {
    constructor(props) {
        super();
        this.state = {
            id: randId(),
            loading: false,
            showOption: false,
            modalConfirmOpen: false
        };
        this.notif = null;
    }
    toggleOption = () => {
        this.setState({ showOption: !this.state.showOption })
    }
    getKey = category => {
        return `${this.state.id}-${category}`;
    }
    handleHoverIn = () => {
        $(`#${this.getKey("desc")}`).css('transform', 'translateX(0px)');
        $(`#${this.getKey("button")}`).css('transform', 'rotate(-90deg)');
    };
    handleHoverOut = () => {
        $(`#${this.getKey("desc")}`).css('transform', 'translateX(80px)');
        $(`#${this.getKey("button")}`).css('transform', 'rotate(0deg)');
    };
    handleDelete = () => {
        axios
            .delete(`/api/directories/${this.props.directory._id}`)
            .then(() => {
                this.notif.display(
                    `${this.props.directory.title} data deleted`,
                    "normal"
                );
                this.setState({ modalConfirmOpen: false }, () => {
                    this.props.reload();
                });
            })
            .catch((err) => {
                console.log("Error", err);
                let errmsg = "error";
                try {
                    errmsg = err.response.data.message;
                } catch {
                } finally {
                    this.notif.display(errmsg, "danger");
                }
            });
    };
    render() {
        return (
            <React.Fragment>
                <NotificationService
                    ref={(element) => { this.notif = element; }} />
                <ConfirmationModal
                    title={"Delete Project"}
                    message={`Are you sure you want to delete ${this.props.directory.title} ?`}
                    warning="warning: this action cannot be undone."
                    value={this.state.modalConfirmOpen}
                    close={() => this.setState({ modalConfirmOpen: false })}
                    submit={this.handleDelete} />
                <Card className={styles.cardRoot}>
                    <CardHeader
                        classes={{
                            title: styles.cardTitle,
                            subheader: styles.cardSubHeader,
                        }}
                        action={
                            this.props.edit &&
                            <React.Fragment>
                                {this.state.showOption &&
                                    <ClickAwayListener onClickAway={this.toggleOption}>
                                        <div className={styles.option}>
                                            <Link
                                                className={styles.optionEditLink}
                                                to={`/edit/directories/${this.props.directory._id}`}>
                                                <p className={styles.optionEdit}>edit</p>
                                            </Link>
                                            <p
                                                className={styles.optionDelete}
                                                onClick={() => { this.setState({ modalConfirmOpen: true }) }} >
                                                delete
                                            </p>
                                        </div>
                                    </ClickAwayListener>
                                }
                                <IconButton onClick={this.toggleOption}>
                                    <MoreVert />
                                </IconButton>
                            </React.Fragment>
                        }
                        title={this.props.directory.title}
                        subheader="September 14, 2016"
                    />
                    <CardMedia
                        component="img"
                        height="240"
                        src={this.props.directory.displays ? this.props.directory.displays[0].url : ""}
                    />
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p">
                            {this.props.directory.description}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <Link
                            to={`/directories/${this.props.directory._id}`}
                            className={styles.showMore}
                            onMouseEnter={this.handleHoverIn}
                            onMouseLeave={this.handleHoverOut}>
                            <div className={styles.showMoreDescContainer}>
                                <p
                                    id={this.getKey("desc")}
                                    className={styles.showMoreDesc}>
                                    Show More
                                </p>
                            </div>
                            <ExpandMore
                                id={this.getKey("button")}
                                className={styles.showMoreButton} />
                        </Link>
                    </CardActions>
                </Card>
            </React.Fragment>
        );
    }
}
export default Directory;
