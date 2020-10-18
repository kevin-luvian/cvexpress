import React, { Component } from "react";
import {
    TextField,
    Checkbox,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from "@material-ui/core";
import {
    AddToPhotos,
    HighlightOff,
    CheckBox,
    CheckBoxOutlineBlank
} from "@material-ui/icons";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { randId, toMb } from "../../../service/utils";
import stylesPrimary from "./directory.module.scss";
import styles from "./editform.module.scss";
import ImageCarousel from "../../carousel/ImageCarousel";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class DirectoryFormEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            displays: [],
            title: "",
            description: "",
            order: 0,
            date: new Date(),
            show: true,
            sectionsRef: [],
            sections: []
        };
    } 
    componentDidMount = () => {
        if (this.props.directory)
            this.setState(this.getDirectoryObject());
    }
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.directory !== prevProps.directory)
            this.setState(this.getDirectoryObject());
    }
    getDirectoryObject = emptyDir => {
        if (emptyDir)
            return {
                _id: randId(),
                displays: [],
                title: "",
                description: "",
                order: 0,
                show: true,
                sections: []
            }
        return {
            _id: this.props.directory._id || randId(),
            displays: this.props.directory.displays || [],
            title: this.props.directory.title || "",
            description: this.props.directory.description || "",
            order: this.props.directory.order || 0,
            show: this.props.directory.show || true,
            sections: this.props.directory.sections || []
        }
    }
    compose = composeDisplay => {
        const composedDirs = [];
        this.state.sectionsRef.forEach((ref) => {
            if (ref !== null) {
                composedDirs.push(ref.compose(composeDisplay));
            }
        })
        const thisDirObj = {
            _id: this.state._id,
            displays: composeDisplay ? this.getDisplaysID() : this.state.displays,
            title: this.state.title,
            description: this.state.description,
            order: parseInt(this.state.order),
            sections: composedDirs
        }
        if (this.props.directory.main) {
            thisDirObj["main"] = true;
            thisDirObj["date"] = this.state.date;
            thisDirObj["show"] = this.state.show;
        }
        return thisDirObj;
    }
    getDisplaysID = () => {
        const displaysID = []
        this.state.displays.forEach(display => {
            displaysID.push(display._id)
        });
        return displaysID
    }
    getDirectoryIndexByID = id => {
        const sections = this.state.sections;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i]._id == id) return i;
        }
        return -1;
    }
    onDelete = directory => {
        const sections = this.state.sections;
        const sectionsRef = this.state.sectionsRef;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i]._id == directory._id) {
                sections.splice(i, 1);
                sectionsRef.splice(i, 1);
                break;
            }
        }
        this.setState({
            sections: sections,
            sectionsRef: sections.length == 0 ? [] : sectionsRef
        }, this.props.updateMainDir);
    }
    addSectionRef = element => {
        if (element !== null) {
            const sectionsRef = this.state.sectionsRef;
            sectionsRef.push(element);
            this.setState({ sectionsRef: sectionsRef });
        }
    };
    createNewSection = () => {
        const obj = this.getDirectoryObject(true);
        const sections = this.state.sections;
        sections.push(obj);
        this.setState({ sections: sections });
    }
    render() {
        return (
            <React.Fragment>
                <div className={styles.container}>
                    <div className={styles.header}>
                        {this.state.title || "New Directory"}
                        {this.props.directory && !this.props.directory.main &&
                            <HighlightOff
                                className={stylesPrimary.deleteIcon}
                                onClick={() => { this.props.onDelete(this.state) }} />
                        }
                    </div>
                    <div className="mt-3">
                        <ImageCarousel displays={this.state.displays} />
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
                            {this.props.directory && this.props.directory.main &&
                                <React.Fragment>
                                    <div className="col-12 col-sm-4">
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
                                    <div className="col-12 col-sm-4">
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
                        {this.state.sections.map((data, index) =>
                            <DirectoryFormEdit
                                key={index}
                                ref={this.addSectionRef}
                                updateMainDir={() => { this.props.updateMainDir(); }}
                                allFiles={this.props.allFiles}
                                directory={data}
                                onDelete={this.onDelete} />
                        )}
                        <div className="text-center mt-3">
                            <button className={styles.button} onClick={this.createNewSection}>
                                <p>Add {this.state.title} Section</p> <AddToPhotos />
                            </button>
                        </div>
                    </div>
                </div >
            </React.Fragment >
        );
    }
}

export default DirectoryFormEdit;