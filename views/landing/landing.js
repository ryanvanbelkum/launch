import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, AsyncStorage } from 'react-native';
import { Button } from 'react-native-elements';
import { Video } from 'expo-av';
import { Text } from '../../components/text/text';
import Constants from 'expo-constants';


import backgroundVid from '../../assets/video/planet-cartoon-space-animation.mp4';
import styles from './landing-styles';

const KEY = '@shaky-shuttle:high-score';

const Landing = ({ navigation }) => {
  const [highScore, setHighScore] = useState(0);
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem(KEY);
      if (value !== null) {
        setHighScore(value);
      }
    } catch (error) {
      console.error('error fetching high score');
    }
  };

  useEffect(() => {
    retrieveData();
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
      />
      <View style={styles.titleContainer}>
        <Text h2 h2Style={styles.title}>
          Shaky Shuttle
        </Text>
        <Text style={styles.highScore}>High score - {highScore}</Text>
      </View>
      <Button
        title="Start"
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
        onPress={() => navigation.navigate('Game')}
      />
      <Text style={styles.version}>{Constants.manifest.version}</Text>
    </View>
  );
};

Landing.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

Landing.navigationOptions = {
  headerShown: false,
};

export default Landing;
