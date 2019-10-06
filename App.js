import React, { PureComponent } from "react";
import { StyleSheet, StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import randomInt from "random-int";

import { Rocket, Floor, Star, Satellite, Planet, UFO } from "./renderers";
import { Tilt, Physics, Trajectory } from "./systems";
import { Accelerometer } from "expo-sensors";

const STAR_COUNT = 20;
const COMPLEXITY = 3;
const { width, height } = Dimensions.get("window");

class App extends PureComponent {
  componentDidMount() {
    this._subscription = Accelerometer.addListener(({ x }) => {
      Matter.Body.set(this.refs.engine.state.entities.rocket.body, {
        tilt: x
      });
    });
  }

  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  setupCollisionHandler = engine => {
    Matter.Events.on(engine, "collisionStart", event => {
      const pairs = event.pairs;
      const objA = pairs[0].bodyA.label;
      const objB = pairs[0].bodyB.label;

      if (objA === "floor" && objB === "star") {
        Matter.Body.setPosition(pairs[0].bodyB, {
          x: randomInt(1, width - 10),
          y: 0
        });
      }

      if (objA === "floor" && objB === "obstacle") {
        Matter.Body.set(pairs[0].bodyB, {
          trajectory: randomInt(-5, 5) / 10
        });
        Matter.Body.setPosition(pairs[0].bodyB, {
          x: randomInt(1, width - 30),
          y: randomInt(0, -200)
        });
      }
    });
  };

  get stars() {
    let stars = {};
    for (let x = 1; x <= STAR_COUNT; x++) {
      const size = randomInt(10, 20);
      Object.assign(stars, {
        ["star_" + x]: {
          body: Matter.Bodies.rectangle(
            randomInt(1, width - 10),
            randomInt(0, height),
            size,
            size,
            {
              frictionAir: 0.1,
              isSensor: true,
              label: "star"
            }
          ),
          opacity: randomInt(1, 5) / 10,
          size: [size, size],
          renderer: Star
        }
      });
    }

    const starsInWorld = Object.values(stars).map(star => star.body);
    return { stars, starsInWorld };
  }

  getSatellite() {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -200),
        75,
        50,
      {
        frictionAir: 0.05,
        label: "obstacle",
        trajectory: randomInt(-5, 5) / 10
      }
    );
    const satellite = { body, size: [75, 50], renderer: Satellite };

    return { obstacle: satellite, body };
  }

  getPlanet() {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -200),
        60,
        40,
      {
        frictionAir: 0.05,
        label: "obstacle",
        trajectory: randomInt(-5, 5) / 10
      }
    );
    const planet = { body, size: [75, 50], renderer: Planet };

    return { obstacle: planet, body };
  }

  getUFO() {
    const body = Matter.Bodies.rectangle(
      randomInt(1, width - 50),
      randomInt(0, -200),
        50,
        20,
      {
        frictionAir: 0.05,
        label: "obstacle",
        trajectory: randomInt(-5, 5) / 10
      }
    );
    const ufo = { body, size: [50, 20], renderer: UFO };

    return { obstacle: ufo, body };
  }

  get obstacles() {
    const options = [this.getSatellite, this.getPlanet, this.getUFO];
    const obstacles = {};
    const bodies = [];

    for (let i = 0; i < COMPLEXITY; i++) {
      const ind = randomInt(0, 2);
      const { obstacle, body } = options[ind]();
      Object.assign(obstacles, { ["obstacle_" + i]: obstacle });
      bodies.push(body);
    }

    return { obstacles, bodies };
  }

  render() {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    const rocket = Matter.Bodies.rectangle(
      width / 2,
      height - 200,
      50,
      50,
      { isStatic: true, tilt: 0, label: "rocket" }
    );
    const floor = Matter.Bodies.rectangle(width / 2, height, width, 10, {
      isStatic: true,
      isSensor: true,
      label: "floor"
    });
    const { obstacles, bodies } = this.obstacles;
    const { stars, starsInWorld } = this.stars;

    this.setupCollisionHandler(engine);
    Matter.World.add(world, [rocket, floor, ...bodies, ...starsInWorld]);

    return (
      <GameEngine
        style={styles.container}
        ref={"engine"}
        systems={[Physics, Tilt, Trajectory]}
        entities={{
          physics: {
            engine,
            world
          },
          ...stars,
          ...obstacles,
          rocket: { body: rocket, size: [50, 115], renderer: Rocket },
          floor: {
            body: floor,
            size: [width, 5],
            renderer: Floor
          }
        }}
      >
        <StatusBar hidden={true} />
      </GameEngine>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9d9d9d"
  }
});

export default App;
