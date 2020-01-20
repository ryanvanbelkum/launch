import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as Font from 'expo-font';


import Game from './views/game/game';
import Landing from './views/landing/landing';

const AppNavigator = createStackNavigator({
    Game,
    Landing
},{
    initialRouteName: 'Landing',
});

export default createAppContainer(AppNavigator);
