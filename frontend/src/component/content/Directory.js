import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import styles from "./contents.module.scss";

class Directory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: "",
            displays: [],
            title: "",
            description: "",
            order: 0,
            show: true,
            sections: []
        };
    }
    componentDidMount = () => {
        if (this.props.directory !== undefined)
            this.setState(this.getDirectoryObject());
    }
    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (this.props.directory !== prevProps.directory)
            this.setState(this.getDirectoryObject());
    }
    getDirectoryObject = () => {
        console.log("thisdir", this.props.directory)
        let displays = this.props.directory.displays || this.props.mainDisplays;
        console.log("propsDisplays", displays)
        displays = displays.length == 0 ? this.props.mainDisplays : displays;
        console.log("thisDisplays", displays)
        return {
            _id: this.props.directory._id || "whaaa",
            displays: displays,
            title: this.props.directory.title || "",
            description: this.props.directory.description || "",
            order: this.props.directory.order || 0,
            show: this.props.directory.show || true,
            sections: this.props.directory.sections || []
        }
    }
    render() {
        const carouselConfig = {
            showArrows: true,
            infiniteLoop: true,
            autoPlay: true,
            stopOnHover: false,
            swipeable: true,
            dynamicHeight: true,
            showStatus: false,
            interval: 10000,
            transitionTime: 1000
        }
        return (
            <React.Fragment>
                <div className="">
                    <Carousel {...carouselConfig} onChange={() => { }} onClickItem={() => { }} onClickThumb={() => { }}>
                        {this.state.displays.map((display, index) => (
                            <div style={{ backgroundColor: "#f7f7f7" }}>
                                <img key={index} src={display.url} style={{ maxWidth: "500px" }} />
                            </div>
                        ))}
                    </Carousel>
                    <div className="">
                        <p>{this.state.title}</p>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
export default Directory;
