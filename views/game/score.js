import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from '../../components/text/text';

import styles from './score-styles';

const Score = ({ score }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{score || 0}</Text>
    </View>
  );
};

Score.propTypes = {
  score: PropTypes.number.isRequired,
};

export default Score;
