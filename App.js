import React, {PureComponent} from 'react';
import { StyleSheet, StatusBar, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import randomInt from 'random-int';

import {Rocket, Box, Star} from "./renderers";
import { Tilt, Physics, Fall } from "./systems"
import {Accelerometer} from "expo-sensors";

class App extends PureComponent {
    componentDidMount() {
        this._subscription = Accelerometer.addListener(({x, y}) => {
            this.refs.engine.publishEvent({ type: "accelerometer", x, y });
        });


    }

    componentWillUnmount() {
        this._subscription && this._subscription.remove();
        this._subscription = null;
    }

    render() {
        const {width, height} = Dimensions.get("window");
        const boxSize = Math.trunc(Math.max(width, height) * 0.005);

        const engine = Matter.Engine.create({enableSleeping: false});
        const world = engine.world;
        const rocket = Matter.Bodies.rectangle(width / 2, height - 200, boxSize, boxSize, {isStatic: true});
        const star = Matter.Bodies.rectangle(randomInt(1, width - 30), 0, boxSize, boxSize);
        const floor = Matter.Bodies.rectangle(width / 2, height - boxSize / 2, width, boxSize, {isStatic: true});

        Matter.World.add(world, [rocket, floor, star]);


        return (
            <GameEngine
                style={styles.container}
                ref={"engine"}
                systems={[Physics, Tilt, Fall]}
                entities={{
                    physics: {
                        engine,
                        world
                    },
                    star: {body: star, size: [boxSize, boxSize], renderer: Star}, //-- Notice that each entity has a unique id (required)
                    rocket: {body: rocket, size: [boxSize, boxSize], position: [40, 200], renderer: Rocket}, //-- Notice that each entity has a unique id (required)
                    floor: { body: floor, size: [width, boxSize], color: "#86E9BE", renderer: Box }
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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

export default App;
