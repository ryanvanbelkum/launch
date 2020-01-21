import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, AsyncStorage } from 'react-native';
import { Button, Icon, Overlay } from 'react-native-elements';
import overlayBack from '../../assets/images/overlay-back.png';
import styles from './game-styles';
import { Text } from '../../components/text/text';

const KEY = '@shaky-shuttle:high-score';

const GameOver = ({ showOverlay, score, reloadApp }) => {
  const storeData = async () => {
    if (showOverlay) {
      try {
        const highScore = (await AsyncStorage.getItem(KEY)) || '0';

        if (score > parseInt(highScore, 10)) {
          await AsyncStorage.setItem(KEY, String(score));
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
        <Text h1 style={styles.overlayText}>
          Score
        </Text>
        <Text h3 style={styles.overlayText}>
          {score}
        </Text>
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
