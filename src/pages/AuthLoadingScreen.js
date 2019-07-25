import React, { Component } from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('@storage_Key');

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        if (userToken) {
            if (userToken.expireDate < new Date())
                this.props.navigation.navigate('App');
            else {
                await AsyncStorage.removeItem('@storage_Key');
                this.props.navigation.navigate('Auth');
            }
        } else {
            this.props.navigation.navigate('Auth');
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

export default AuthLoadingScreen