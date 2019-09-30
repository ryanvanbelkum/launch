import Matter from "matter-js";
import {Dimensions} from "react-native";

const { width, height } = Dimensions.get('window');

const Tilt = (state, { events }) => {
    let e = events.find(x => x.type === "accelerometer");
    if (!e) return state;

    let rocket = state["rocket"];
    let xPos = rocket.body.position.x;

    if(xPos >= width - 50 && e.x > 0) {
        xPos = width - 25;
    } else if(xPos <= 0 && e.x < 0){
        xPos = 0;
    } else {
        xPos = xPos + (e.x * 20);
    }

    Matter.Body.setPosition(rocket.body, {
        x: xPos,
        y: height - 200
    });

    return state;
};

const Fall = (state ) => {
    // let star = state["star"];
    // Matter.Body.setPosition(star.body, {
    //     y: height - 200
    // });

    return state;
};

const Physics = (entities, { time }) => {
    let engine = entities["physics"].engine;
    engine.world.gravity.y = 0.5;
    Matter.Engine.update(engine, time.delta);
    return entities;
};

export { Tilt, Physics, Fall };
