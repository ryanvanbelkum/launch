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
        xPos = xPos + (e.x * 15);
    }

    Matter.Body.setPosition(rocket.body, {
        x: xPos,
        y: height - 200
    });

    return state;
};

const Trajectory = (entities) => {
    const obstacles = Object.values(entities).filter(item => item.body && item.body.label === "obstacle");

    obstacles.forEach(item => {
        // console.log(item);
        Matter.Body.setPosition(item.body, {
            x: item.body.position.x + (item.trajectory),
            y: item.body.position.y
        });
    });

    return entities;
};

const Physics = (entities, { time }) => {
    let engine = entities["physics"].engine;
    engine.world.gravity.y = 0.5;
    Matter.Engine.update(engine, time.delta);
    return entities;
};

export { Tilt, Physics, Trajectory };
