import { rHeight } from '@styles/Spacing';
import { Colors, Layout } from '@styles/index';
import React, { Component } from 'react';
import {
    View,
    Modal,
    ActivityIndicator
} from 'react-native';

export default class Loader extends Component {
    render() {
        return (
            <Modal
                transparent
                // visible={this.state.isLoading}
                visible={true}
            >
            <View
                style={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                }}
            >
                
                <ActivityIndicator
                    size={rHeight(10)}
                    color={Colors.ABM_LIGHT_BLUE}
                    style={{backgroundColor:'white',borderRadius:50}}
                />
            </View>
            </Modal>
        );
    }
}

export class LoadingComponent extends Component {
    render() {
        return (
            <ActivityIndicator
                size={rHeight(7)}
                color={Colors.ABM_LIGHT_BLUE}
                style={{alignSelf: 'center',backgroundColor:'white',borderRadius:50, ...Layout.shadow}}
            />
        );
    }
}