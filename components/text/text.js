import React from 'react';
import {Text as RNEText} from 'react-native-elements';

function getStyles(props){
    let returnProps = {...props};
    delete returnProps.style;

    return returnProps;
}

const Text = (props) => {
    return (
        <RNEText style={{fontFamily: 'orbitron', ...props.style}} {...getStyles(props)} />
    );
};

export default Text;
export {Text}
