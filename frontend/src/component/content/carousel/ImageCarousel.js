import React, { Component } from "react";
import Slider from "react-slick";
import styles from "./imagecarousel.module.scss";

class ImageCarousel extends Component {
    constructor(props) {
        super();
    }
    render() {
        const settings = {
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            swipeToSlide: true,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
        };
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        return (
            <React.Fragment>
                <Slider {...settings}>
                    {items.map((item, index) => {
                        return (
                            <div key={index} className={styles.imageItem}>
                                <h3>{item}</h3>
                            </div>
                        );
                    })}
                </Slider>
            </React.Fragment>
        );
    };
};

export default ImageCarousel;


