import React, { Component } from "react";
import Slider from "react-slick";
import styles from "./imagecarousel.module.scss";

class ImageCarousel extends Component {
    constructor(props) {
        super();
    }
    createID = (str_param, category) => {
        return `id-${category}-${str_param}`
    }
    displayLength = () => {
        if (this.props.displays.length > 3)
            return 3;
        return this.props.displays.length;
    }
    handleClick = obj => {
        console.log(`Clicked ${obj.filename}`);
    }
    render() {
        return (
            <React.Fragment>
                <Slider
                    dots={true}
                    infinite={this.props.displays.length > 0}
                    speed={500}
                    slidesToShow={this.displayLength()}
                    slidesToScroll={3}
                    swipeToSlide={true}
                    pauseOnHover={true}
                    autoplay={true}
                    autoplaySpeed={3000}
                    adaptiveHeight={false}
                >
                    {this.props.displays.map((elem, index) => (
                        <div
                            key={index}
                            className={styles.imageItem}
                            onClick={() => { this.handleClick(elem) }}
                        >
                            <img src={elem.url} />
                        </div>
                    ))}
                </Slider>
            </React.Fragment>
        );
    };
};

export default ImageCarousel;


