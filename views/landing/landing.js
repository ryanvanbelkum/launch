import React, {useState, useEffect} from 'react';
import {View, AsyncStorage} from 'react-native';
import {Button} from "react-native-elements";
import { Video } from 'expo-av';
import {Text} from '../../components/text/text';

import backgroundVid from '../../assets/video/planet-cartoon-space-animation.mp4';
import styles from './landing-styles.js';

const Landing = ({navigation}) => {
    const [highScore, setHighScore] = useState(0);
    const retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('@shaky-shuttle:high-score');
            if (value !== null) {
                setHighScore(value);
            }
        } catch (error) {
            console.error("error fetching high score");
        }
    };

    useEffect(() => {
        retrieveData()
    }, []);

    return (
        <View style={styles.container}>
            <Video
                source={backgroundVid}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.video}
            >
            </Video>
                <View style={styles.titleContainer}>
                    <Text h2 h2Style={styles.title}>Shaky Shuttle</Text>
                    <Text style={styles.highScore}>High score - {highScore}</Text>
                </View>
                <Button
                    title="Start"
                    buttonStyle={styles.button}
                    titleStyle={styles.buttonTitle}
                    onPress={() => navigation.navigate('Game')}
                />
        </View>
    );
};

Landing.navigationOptions = {
    header: null,
};

export default Landing;
