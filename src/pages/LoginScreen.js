import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { userLogin } from '../actions/user_action'
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-root-toast';

class LoginScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            orientation: this.isPortrait() ? 'portrait' : 'landscape',
            test: []
        }

        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: this.isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }

    updateInfo = (val, key) => {
        this.setState({
            [key]: val
        })
    }

    isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };


    componentDidMount = async () => {
        let user = await AsyncStorage.getItem('userinfo');
        if (user) {
            this.props.navigation.navigate('App')
        }
    }

    _showToaste = (msg) => {
        Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls on toast\`s appear animation start
            },
            onShown: () => {
                // calls on toast\`s appear animation end.
            },
            onHide: () => {
                // calls on toast\`s hide animation start.
            },
            onHidden: () => {
                // calls on toast\`s hide animation end.
            }
        });
    }

    _loginAsync = () => {
        this.props.userLogin(this.state.username, this.state.password)
            .then(async (res) => {
                console.log(res)
                if (res.error)
                    this._showToaste(res.error)
                else {
                    try {
                        await AsyncStorage.setItem('userinfo', res.user_token)
                    } catch (err) {
                        console.log(err)
                    }
                    this.props.navigation.navigate('App')
                }
            })
            .catch(err => {
                console.log(err)

            })
        // if (this.state.username.toLowerCase() == 'admin' && this.state.password.toLowerCase() == 'opay') {
        //     let date = new Date();
        //     let storageInfo = {
        //         val: this.state.username,
        //         expireDate: date.setDate(date.getDate() + 1)

        //     }
        //     try {
        //         await AsyncStorage.setItem('userinfo', storageInfo)
        //     } catch (err) {
        //         console.log(err)
        //     }
        //     this.props.navigation.navigate('App')
        // }
    }

    _navigateClinetsSide = () => {
        this.props.navigation.navigate('Clients')
    }

    render() {

        if (this.state.orientation === 'portrait') {
            return (
                <View style={styles.pageStyle}>
                    <Image
                        source={require('../static/img/1.jpeg')}
                        style={styles.backgroundStyle}
                    />
                    <SafeAreaView style={styles.pageContentStyle}>
                        <View style={styles.profile}>
                            <Image
                                style={styles.logoStyle}
                                source={require('../static/img/logo.png')}
                            />
                            <Text style={styles.profileTitle}>Sunny Delivery System</Text>
                            <View style={styles.textInputContainerStyle}>
                                <Icon style={styles.iconStyle} name="user-tie" size={20} color="#000000" />
                                <TextInput
                                    autoCompleteType={'off'}
                                    style={styles.textInputStyle}
                                    onChangeText={(text) => this.updateInfo(text, 'username')}
                                    value={this.state.username}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon style={styles.iconStyle} name="key" size={20} color="#000000" />
                                <TextInput
                                    autoCompleteType={'off'}
                                    secureTextEntry={true}
                                    style={styles.textInputStyle}
                                    onChangeText={(text) => this.updateInfo(text, 'password')}
                                    value={this.state.password}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={this._loginAsync}
                            >
                                <Text style={styles.buttonTextStyle}>Log In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={this._navigateClinetsSide}
                            >
                                <Text style={styles.buttonTextStyle}>Client Side</Text>
                            </TouchableOpacity>
                        </View >
                    </SafeAreaView>
                </View>
            )
        } else {
            return (
                <View style={styles.pageStyle}>
                    <Image
                        source={require('../static/img/1L.jpg')}
                        style={styles.backgroundStyle}
                    />
                    <SafeAreaView style={styles.pageContentStyle}>
                        <View style={styles.profile}>
                            {/* <Image
                                style={styles.logoStyle}
                                source={require('../static/img/logo.png')}
                            /> */}
                            <Text style={styles.profileTitle}>Sunny Delivery System</Text>
                            <View style={styles.textInputContainerStyle}>
                                <Icon style={styles.iconStyle} name="user-tie" size={20} color="#000000" />
                                <TextInput
                                    autoCompleteType={'off'}
                                    style={styles.textInputStyle}
                                    onChangeText={(text) => this.updateInfo(text, 'username')}
                                    value={this.state.username}
                                />
                            </View>
                            <View style={styles.textInputContainerStyle}>
                                <Icon style={styles.iconStyle} name="key" size={20} color="#000000" />
                                <TextInput
                                    autoCompleteType={'off'}
                                    secureTextEntry={true}
                                    style={styles.textInputStyle}
                                    onChangeText={(text) => this.updateInfo(text, 'password')}
                                    value={this.state.password}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={this._loginAsync}
                            >
                                <Text style={styles.buttonTextStyle}>Log In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                onPress={this._navigateClinetsSide}
                            >
                                <Text style={styles.buttonTextStyle}>Client Side</Text>
                            </TouchableOpacity>
                        </View >
                    </SafeAreaView>
                </View>
            )
        }
    }

    addNote = () => {

    }
}

var styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundStyle: {
        resizeMode: 'cover',
        flex: 1
    },
    pageContentStyle: {
        position: 'absolute',
        flex: 1,
        left: 0,
        right: 0,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(0,0,0,0.5)',
    },
    profile: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    logoStyle: {
        width: 100,
        height: 140,
    },
    profileTitle: {
        fontSize: 26,
        alignSelf: 'center',
        fontWeight: '600',
        fontFamily: 'Gill Sans',
        marginVertical: 12,
    },
    textInputContainerStyle: {
        flex: 1,
        height: 40,
        width: 300,
        margin: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#fff'
    },
    iconStyle: {
        padding: 10,
    },
    textInputStyle: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        // backgroundColor: '#fff',
        color: '#424242',
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dddddd',
        margin: 16,
        height: 40,
        width: 200,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#fff'
    },
    buttonTextStyle: {
        fontSize: 18,
        // color: '#000000'
    }
})

const mapStateToProps = state => {
    console.log(state)
    return {
        // userToken
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ userLogin }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)