import DateFnsUtils from "@date-io/date-fns";
import {
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import {
    AddToPhotos,
    CheckBox,
    CheckBoxOutlineBlank,
    HighlightOff
} from "@material-ui/icons";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
    KeyboardDatePicker, MuiPickersUtilsProvider
} from "@material-ui/pickers";
import React, { Component } from "react";
import Carousel from 'react-material-ui-carousel';
import { randId, toMb } from "../../../service/utils";
import NotificationService from "../../standalone/NotificationService";
import stylesPrimary from "./directory.module.scss";
import styles from "./editform.module.scss";

class DirectoryForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displays: [],
            title: "",
            description: "",
            order: 0,
            date: new Date(),
            show: true,
            childDirectories: [],
            childAssignedIDs: []
        };
        this.notif = React.createRef();
    }
    compose = () => {
        const composedDirs = [];
        this.state.childDirectories.forEach((directory) => {
            if (directory !== null) {
                composedDirs.push(directory.compose());
            }
        })
        const thisDirObj = {
            displays: this.getDisplaysID(),
            title: this.state.title,
            description: this.state.description,
            order: parseInt(this.state.order),
            sections: composedDirs
        }
        if (!this.props.assignedID) {
            thisDirObj["main"] = true;
            thisDirObj["date"] = this.state.date;
            thisDirObj["show"] = this.state.show;
        }
        console.log("Composed Obj", thisDirObj)
        return thisDirObj;
    }
    getDisplaysID = () => {
        const displaysID = []
        this.state.displays.forEach(display => {
            displaysID.push(display._id)
        });
        return displaysID
    }
    onDelete = assignedID => {
        const childAssignedIDs = this.state.childAssignedIDs;
        const childDirectories = this.state.childDirectories;
        const index = childAssignedIDs.indexOf(assignedID);
        if (index > -1) {
            childAssignedIDs.splice(index, 1);
            childDirectories[index].clearChildDirs();
            childDirectories.splice(index, 1);
        }
        this.setState({
            childAssignedIDs: childAssignedIDs,
            childDirectories: childDirectories
        });
    }
    clearChildDirs = () => {
        this.state.childDirectories.forEach(directory => {
            directory.clearChildDirs();
        });
        this.setState({
            childAssignedIDs: [],
            childDirectories: []
        });
    }
    createDir = () => {
        this.setState({ childAssignedIDs: [...this.state.childAssignedIDs, randId()] });
    };
    addChildRef = element => {
        if (element !== null) {
            const childDirectories = this.state.childDirectories;
            childDirectories.push(element);
            this.setState({ childDirectories: childDirectories });
        }
    };
    render() {
        return (
            <React.Fragment>
                <NotificationService ref={this.notif} />
                <div className={styles.container}>
                    <div className={styles.header}>
                        {this.state.title || "New Directory"}
                        {this.props.assignedID &&
                            <HighlightOff
                                className={stylesPrimary.deleteIcon}
                                onClick={() => { this.props.onDelete(this.props.assignedID) }} />
                        }
                    </div>
                    <div className="mt-3">
                        <Carousel interval={5000}>
                            {
                                this.state.displays.map((display, index) => (
                                    <img key={index}
                                        src={display.url}
                                        className={stylesPrimary.centerImage} />
                                ))
                            }
                        </Carousel>
                    </div>
                    <div className={`mt-4 ${styles.inputContainer}`}>
                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            className={`mt-3 ${styles.input}`}
                            options={this.props.allFiles}
                            value={this.state.displays}
                            onChange={(event, values) => {
                                this.setState({ displays: values });
                            }}
                            getOptionLabel={(option) => option.filename}
                            renderOption={(option, { selected }) => (
                                <React.Fragment>
                                    <Checkbox
                                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                                        checkedIcon={<CheckBox fontSize="small" />}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    <div className="row w-100 m-0">
                                        <div className="col">{option.filename}</div>
                                        <div className="col text-right my-auto">{toMb(option.size)} Mb</div>
                                    </div>
                                </React.Fragment>
                            )}
                            renderInput={(params) => <TextField {...params} label="Displays" />} />
                        <TextField
                            className={styles.input}
                            label="Title"
                            value={this.state.title}
                            onChange={(e) => {
                                this.setState({ title: e.target.value });
                            }} />
                        <TextField
                            className={styles.input}
                            label="Description"
                            multiline
                            rows={2}
                            rowsMax={5}
                            value={this.state.description}
                            onChange={(e) => {
                                this.setState({ description: e.target.value });
                            }} />
                        <div className="row mb-3">
                            <div className="col">
                                <TextField
                                    className={styles.input}
                                    label="Order"
                                    type="number"
                                    value={this.state.order}
                                    onChange={(e) => {
                                        this.setState({ order: e.target.value });
                                    }} />
                            </div>
                            {!this.props.assignedID &&
                                <React.Fragment>
                                    <div className="col-12 col-md-4">
                                        <FormControl className={styles.input}>
                                            <InputLabel>Show</InputLabel>
                                            <Select
                                                value={this.state.show}
                                                onChange={(e) => {
                                                    this.setState({ show: e.target.value })
                                                }} >
                                                <MenuItem value={false}>Private</MenuItem>
                                                <MenuItem value={true}>Public</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <KeyboardDatePicker
                                                disableToolbar
                                                className={`${styles.input} w-100 mt-0`}
                                                variant="inline"
                                                format="MM/dd/yyyy"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Date picker inline"
                                                value={this.state.date}
                                                onChange={(e) => { this.setState({ date: e }) }}
                                                KeyboardButtonProps={{
                                                    "aria-label": "change date",
                                                }} />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                        {this.state.childAssignedIDs.map((childIDs, index) =>
                            <DirectoryForm
                                key={index}
                                ref={this.addChildRef}
                                allFiles={this.props.allFiles}
                                assignedID={childIDs}
                                onDelete={this.onDelete} />
                        )}
                        <div className="text-center mt-3">
                            <button className={styles.button} onClick={this.createDir}>
                                <p>Add {this.state.title} Child</p> <AddToPhotos />
                            </button>
                        </div>
                    </div>
                </div >
            </React.Fragment >
        );
    }
}

export default DirectoryForm;