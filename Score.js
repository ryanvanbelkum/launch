import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const Score = ({score}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{score || 0}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        borderRadius: 10,
        margin: 25,
        backgroundColor: 'white'
    },
    text: {
        fontSize: 20,
        padding: 10,
    }
});

export default Score;
