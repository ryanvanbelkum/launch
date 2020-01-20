import React, {PureComponent} from 'react';
import * as Font from 'expo-font';
import AppNavigator from "./nav-stack";
import { AppLoading } from 'expo';


export default class App extends PureComponent {
    state = {
        isLoadingComplete: false,
    };

    loadResourcesAsync = async () => Promise.all([
        Font.loadAsync({
            orbitron: require('./assets/fonts/Orbitron-VariableFont-wght.ttf'),
        }),
    ]);

    handleLoadingError = (error) => {
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

        return (
            <AppNavigator />
        )
    }
};
