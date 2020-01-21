import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, AsyncStorage, View } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';
import overlayBack from '../../assets/images/overlay-back.png';
import styles from './game-styles';
import { Text } from '../../components/text/text';

const KEY = '@shaky-shuttle:high-score';

const GameOver = ({ showOverlay, score, reloadApp }) => {
  const [highScore, setHighScore] = useState('0');

  const storeData = async () => {
    if (showOverlay) {
      try {
        const storageHighScore = (await AsyncStorage.getItem(KEY)) || '0';

        if (score > parseInt(storageHighScore, 10)) {
          setHighScore(score);
          await AsyncStorage.setItem(KEY, String(score));
        } else {
          setHighScore(storageHighScore);
        }
      } catch (error) {
        console.error('error saving high score');
      }
    }
  };

  useEffect(() => {
    storeData();
  }, [showOverlay]);

  return (
    <Overlay isVisible={showOverlay}>
      <ImageBackground
        source={overlayBack}
        style={styles.overlay}
        imageStyle={{ opacity: 0.8, backgroundColor: 'rgba(0,0,0,.6)' }}
      >
        <Text h1 h1Style={styles.overlayText}>
          Score
        </Text>
        <Text h3 h3Style={styles.overlayText}>
          {score}
        </Text>
        <Text style={styles.overlayText}>High score - {highScore}</Text>
        <Button
          title="Restart"
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          onPress={reloadApp}
          icon={<Icon name="rocket" size={25} type="font-awesome" color="#BB1F13" />}
          iconRight
        />
      </ImageBackground>
    </Overlay>
  );
};

GameOver.propTypes = {
  showOverlay: PropTypes.bool.isRequired,
  score: PropTypes.number.isRequired,
  reloadApp: PropTypes.func.isRequired,
};

export default GameOver;
