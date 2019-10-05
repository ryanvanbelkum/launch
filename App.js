import React, {PureComponent} from 'react';
import {StyleSheet, StatusBar, Dimensions} from "react-native";
import {GameEngine} from "react-native-game-engine";
import Matter from "matter-js";
import randomInt from 'random-int';

import {Rocket, Box, Star, Satellite} from "./renderers";
import {Tilt, Physics, Trajectory} from "./systems"
import {Accelerometer} from "expo-sensors";

const STAR_COUNT = 20;
const COMPLEXITY = 3;
const {width, height} = Dimensions.get("window");
const boxSize = Math.trunc(Math.max(width, height) * 0.005);

class App extends PureComponent {
    componentDidMount() {
        this._subscription = Accelerometer.addListener(({x, y}) => {
            this.refs.engine.publishEvent({type: "accelerometer", x, y});
        });
    }

    componentWillUnmount() {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    setupCollisionHandler = (engine) => {
        Matter.Events.on(engine, "collisionStart", (event) => {
            const pairs = event.pairs;
            const objA = pairs[0].bodyA.label;
            const objB = pairs[0].bodyB.label;

            if (objA === 'floor' && objB === 'star') {
                Matter.Body.setPosition(pairs[0].bodyB, {
                    x: randomInt(1, width - 30),
                    y: 0
                });
            }
        });
    };

    get stars() {
        let stars = {};
        for (let x = 1; x <= STAR_COUNT; x++) {
            Object.assign(stars, {
                ['star_' + x]: {
                    body: Matter.Bodies.rectangle(randomInt(1, width - 30), randomInt(0, height), boxSize, boxSize, {
                        frictionAir: .2,
                        isSensor: true,
                        label: 'star'
                    }),
                    opacity: randomInt(1, 5) / 10,
                    size: [boxSize, boxSize],
                    renderer: Star
                }
            });
        }

        return stars;
    }

    render() {
        const engine = Matter.Engine.create({enableSleeping: false});
        const world = engine.world;
        const rocket = Matter.Bodies.rectangle(width / 2, height - 200, boxSize, boxSize, {isStatic: true});
        const satellite = Matter.Bodies.rectangle(randomInt(1, width - 50), 0, 75, 50, {
            frictionAir: .05,
            label: "obstacle"
        });
        const floor = Matter.Bodies.rectangle(width / 2, height, width, 10, {
            isStatic: true,
            isSensor: true,
            label: "floor"
        });
        const stars = this.stars;
        const starsInWorld = Object.values(stars).map(star => star.body);

        this.setupCollisionHandler(engine);
        Matter.World.add(world, [rocket, floor, satellite, ...starsInWorld]);

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
                    rocket: {body: rocket, size: [boxSize, boxSize], position: [40, 200], renderer: Rocket},
                    satellite: {body: satellite, size: [boxSize, boxSize], renderer: Satellite, trajectory: .25},
                    floor: {body: floor, size: [width, boxSize], color: "#86E9BE", renderer: Box}
                }}>

                <StatusBar hidden={true}/>

            </GameEngine>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9d9d9d',
    },
});

export default App;
