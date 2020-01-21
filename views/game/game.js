import React, {PureComponent} from "react";
import {StatusBar, Dimensions, AppState} from "react-native";
import {GameEngine} from "react-native-game-engine";
import Matter from "matter-js";
import randomInt from "random-int";
import GameOver from "./game-over";

import {Rocket, Floor, Star, Satellite, Planet, UFO} from "./renderers";
import {Tilt, Physics, Trajectory} from "./systems";
import {Accelerometer} from "expo-sensors";
import Score from "./score";

const STAR_COUNT = 20;
const {width, height} = Dimensions.get("window");
import styles from './game-styles';

class Game extends PureComponent {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);

        this.state = this.initState;
    }

    componentDidMount() {
        this._subscription = Accelerometer.addListener(({x}) => {
            Matter.Body.set(this.refs.engine.state.entities.rocket.body, {
                tilt: x
            });
        });

        this.incrementScore();
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.complexity !== prevState.complexity) {
            const {world} = this.refs.engine.props.entities.physics;
            const {obstacle, body} = this.obstacle;

            Matter.World.addBody(world, body);
            const updatedObstacles = {
                ...this.state.entities,
                physics: {
                    ...this.state.entities.physics,
                    world
                },
                ["obstacle_" + (this.state.complexity -1)]: obstacle
            };

            this.setState({entities: updatedObstacles});
            this.refs.engine.swap(updatedObstacles);
        }
    }

    componentWillUnmount() {
        this._subscription && this._subscription.remove();
        this._subscription = null;
        AppState.removeEventListener('change', this.handleAppStateChange);
    }


    handleAppStateChange = (nextAppState) => {
        this.setState({appState: nextAppState});
    };

    reloadApp = () => {
        this.setState(this.initState, () => {
            this.refs.engine.swap(this.entities);
            this.incrementScore();
        });
    };

    incrementScore = () => {
        if(!this.state.showOverlay){
            this.setState(
                ({score}) => {
                    const increase = Math.floor(score / 150);
                    const complexity = increase < 3 ? 3 : increase;

                    return {score: score + 1, complexity};
                },
                () => setTimeout(this.incrementScore, 100)
            );
        }
    };

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
                    y: randomInt(0, -100)
                });
            }

            if (objA === "rocket" && objB === "obstacle") {
                this.setState({showOverlay: true})
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
        return {stars, starsInWorld};
    }

    get obstacle() {
        const options = [this.getSatellite, this.getPlanet, this.getUFO];
        const ind = randomInt(0, options.length - 1);
        const {obstacle, body} = options[ind]();

        return {obstacle, body};
    }

    getSatellite() {
        const body = Matter.Bodies.rectangle(
            randomInt(1, width - 50),
            randomInt(0, -200),
            75,
            45,
            {
                frictionAir: 0.05,
                label: "obstacle",
                trajectory: randomInt(-5, 5) / 10
            }
        );
        const satellite = {body, size: [75, 50], renderer: Satellite};

        return {obstacle: satellite, body};
    }

    getPlanet() {
        const body = Matter.Bodies.rectangle(
            randomInt(1, width - 50),
            randomInt(0, -200),
            60,
            35,
            {
                frictionAir: 0.05,
                label: "obstacle",
                trajectory: randomInt(-5, 5) / 10
            }
        );
        const planet = {body, size: [75, 50], renderer: Planet};

        return {obstacle: planet, body};
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
        const ufo = {body, size: [50, 20], renderer: UFO};

        return {obstacle: ufo, body};
    }

    get obstacles() {
        const obstacles = {};
        const bodies = [];

        for (let i = 0; i < 3; i++) {
            const {obstacle, body} = this.obstacle;
            Object.assign(obstacles, {["obstacle_" + i]: obstacle});
            bodies.push(body);
        }

        return {obstacles, bodies};
    }

    get initState() {
        return {
            complexity: 3,
            score: 0,
            entities: this.entities,
            showOverlay: false,
            appState: 'active'
        };
    }

    get entities() {
        const engine = Matter.Engine.create({enableSleeping: false});
        const world = engine.world;
        const rocket = Matter.Bodies.rectangle(width / 2, height - 200, 25, 50, {
            isStatic: true,
            tilt: 0,
            label: "rocket"
        });
        const floor = Matter.Bodies.rectangle(width / 2, height, width + 100, 10, {
            isStatic: true,
            isSensor: true,
            label: "floor"
        });
        const {obstacles, bodies} = this.obstacles;
        const {stars, starsInWorld} = this.stars;

        this.setupCollisionHandler(engine);
        Matter.World.add(world, [rocket, floor, ...bodies, ...starsInWorld]);

        return {
            physics: {
                engine,
                world
            },
            ...stars,
            ...obstacles,
            rocket: {body: rocket, size: [50, 100], renderer: Rocket},
            floor: {
                body: floor,
                size: [width + 100, 5],
                renderer: Floor
            }
        };
    }

    render() {
        const {showOverlay, complexity, entities, score, appState} = this.state;
        return (
            <GameEngine
                style={styles.container}
                ref={"engine"}
                systems={[Physics, Tilt, Trajectory]}
                entities={entities}
                running={appState === 'active'}
            >
                <Score score={score} complexity={complexity} />
                <StatusBar hidden={true}/>
                <GameOver showOverlay={showOverlay} score={score} reloadApp={this.reloadApp} />
            </GameEngine>
        );
    }
}

export default Game;
