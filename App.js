import React, { PureComponent } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import AppNavigator from './nav-stack';

export default class App extends PureComponent {
  state = {
    isLoadingComplete: false,
  };

  loadResourcesAsync = async () =>
    Promise.all([
      Asset.loadAsync([
        require('./assets/images/icon.png'),
        require('./assets/images/overlay-back.png'),
        require('./assets/images/planet.png'),
        require('./assets/images/rocketwithflames.gif'),
        require('./assets/images/satellite.png'),
        require('./assets/images/splash.png'),
        require('./assets/images/star.png'),
        require('./assets/images/ufo.gif'),
      ]),
      Font.loadAsync({
        orbitron: require('./assets/fonts/Orbitron-VariableFont-wght.ttf'),
      }),
    ]);

  handleLoadingError = error => {
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }

    return <AppNavigator />;
  }
}
