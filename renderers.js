import React from "react";
import { StyleSheet, Dimensions, View, Image } from "react-native";

import rocket from './assets/images/rocketwithflames.gif';
import satellite from './assets/images/satellite.png';
import planet from './assets/images/planet.png';

import star from './assets/images/star.png';

const { height, width } = Dimensions.get('window');

const BODY_DIAMETER = Math.trunc(Math.max(width, height) * 0.05);

const Rocket = ({body}) => {
    const {position} = body;
    let x = position.x - BODY_DIAMETER / 2;
    const y = position.y;

    return (
        <Image
            source={rocket}
            style={[
                styles.rocket,
                {
                    left: x,
                    top: y
                }
            ]}
        />
    );
};

const Satellite = ({body}) => {
    const {position} = body;
    let x = position.x - BODY_DIAMETER / 2;
    const y = position.y;

    return (
        <Image
            source={satellite}
            style={[
                styles.satellite,
                {
                    left: x,
                    top: y
                }
            ]}
        />
    );
};

const Star = ({body, size, opacity}) => {
    const sizeWidth = size[0];
    const sizeHeight = size[1];
    const x = body.position.x - sizeWidth / 2;
    const y = body.position.y - sizeHeight / 2;

    return (
        <Image
            source={star}
            style={[
                styles.star,
                {
                    left: x,
                    top: y,
                    width: sizeWidth,
                    height: sizeHeight,
                    opacity
                }
            ]}
        />
    );
};


const Box = ({ body, size, color }) => {
    const width = size[0];
    const height = size[1];

    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;

    return (
        <View
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: color
            }}
        />
    );
};

const styles = StyleSheet.create({
    rocket: {
        width: 50,
        height: 100,
        position: "absolute"
    },
    satellite: {
        width: 75,
        height: 50,
        position: "absolute"
    },
    star: {
        position: "absolute"
    }
});

export { Rocket, Box, Star, Satellite };
