import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import randomInt from 'random-int';

const { width, height } = Dimensions.get('window');

const Tilt = state => {
  const { rocket } = state;
  const xTilt = rocket.body.tilt;
  let xPos = rocket.body.position.x;

  if (xPos >= width - 25 && xTilt > 0) {
    xPos = width - 25;
  } else if (xPos <= 25 && xTilt < 0) {
    xPos = 25;
  } else {
    xPos += xTilt * 5;
  }

  Matter.Body.setPosition(rocket.body, {
    x: xPos,
    y: height - 200,
  });

  return state;
};

const Trajectory = entities => {
  const obstacles = Object.values(entities).filter(
    item => item.body && item.body.label === 'obstacle'
  );

  obstacles.forEach(item => {
    if (item.body.position.x > width || item.body.position.x < 0) {
      Matter.Body.set(item.body, {
        trajectory: randomInt(-5, 5) / 10,
      });
      Matter.Body.setPosition(item.body, {
        x: randomInt(0, width - 30),
        y: 0,
      });
    }

    Matter.Body.setPosition(item.body, {
      x: item.body.position.x + item.body.trajectory,
      y: item.body.position.y,
    });
  });

  return entities;
};

const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  engine.world.gravity.y = 0.5;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

export { Tilt, Physics, Trajectory };
