import React, { Component } from "react";
import Slider from "react-slick";
import styles from "./imagecarousel.module.scss";

class ImageCarousel extends Component {
    constructor(props) {
        super();
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
        const settings = {
        };
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <React.Fragment>
                <Slider
                    dots={true}
                    infinite={this.props.displays.length > 0}
                    speed={500}
                    slidesToShow={this.displayLength()}
                    slidesToScroll={3}
                    pauseOnHover={true}
                    autoplay={true}
                    autoplaySpeed={3000}
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


