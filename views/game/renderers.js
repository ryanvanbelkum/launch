import React from "react";
import { StyleSheet, View, Image } from "react-native";

import rocket from "../../assets/images/rocketwithflames.gif";
import satellite from "../../assets/images/satellite.png";
import planet from "../../assets/images/planet.png";
import ufo from "../../assets/images/ufo.gif";
import star from "../../assets/images/star.png";

const Rocket = ({ body, size }) => {
  const { position } = body;
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const x = position.x - sizeWidth / 2;
  const y = position.y;

  return (
    <Image
      source={rocket}
      style={[
        styles.rocket,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight
        }
      ]}
    />
  );
};

const Satellite = ({ body, size }) => {
  const { position } = body;
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  let x = position.x - sizeWidth / 2;
  const y = position.y;

  return (
    <Image
      source={satellite}
      style={[
        styles.satellite,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight
        }
      ]}
    />
  );
};

const Planet = ({ body, size }) => {
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const { position } = body;
  let x = position.x - sizeWidth / 2;
  const y = position.y;

  return (
    <Image
      source={planet}
      style={[
        styles.satellite,
        {
          left: x,
          top: y,
          width: sizeWidth,
          height: sizeHeight
        }
      ]}
    />
  );
};

const Star = ({ body, size, opacity }) => {
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

const UFO = ({ body, size }) => {
  const sizeWidth = size[0];
  const sizeHeight = size[1];
  const x = body.position.x - sizeWidth / 2;
  const y = body.position.y - sizeHeight / 2;

  return (
    <Image
      source={ufo}
      style={[
        styles.ufo,
        {
          left: x,
          top: y
        }
      ]}
    />
  );
};

const Floor = ({ body, size }) => {
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
        backgroundColor: "transparent"
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
    position: "absolute"
  },
  planet: {
    width: 75,
    height: 50,
    position: "absolute"
  },
  ufo: {
    width: 75,
    height: 50,
    position: "absolute"
  },
  star: {
    position: "absolute"
  }
});

export { Rocket, Floor, Star, Satellite, Planet, UFO };
