import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-root-toast';
import { fetchOrders, updateOrder } from '../actions/merchant_action'

class PickupScreen extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            order_uuid: null,
            currentPosition: 0,
        }
        this.scrolling = this.scrolling.bind(this)
        this.showToast = this.showToast.bind(this)
    }

    updateOrderId = (val) => {
        this.setState({
            order_uuid: val
        })
    }

    componentDidMount() {
        console.log(this.props.orders[0].data)
        // this.activeInterval = setInterval(this.scrolling, 2000);
    }

    // componentWillUnmount() {
    //     clearInterval(this.activeInterval);
    // }

    pickupOrder = () => {
        let in_list = this.props.orders[1].data.some(el => el.order_uuid == this.state.order_uuid)

        if (!in_list) {
            this.props.updateOrder(this.state.order_uuid, this.props.orders[1].status)
                .then(async (res) => {
                    this.showToast(true, 'Please come to pick up your order')
                    await this.props.fetchOrders()
                })
        } else
            this.showToast(false, 'Your order is already in the list!')
    }

    showToast = (flag, msg) => {
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: !flag ? '#ff0000' : '#33cc33',
            textColor: '#fff',
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

    // Scrolling Animation
    scrolling() {
        // Start scrolling if there's more than one complete orders to display
        if (this.state.complete_orders.length > 1) {
            // Increment position with each new interval
            position = this.state.currentPosition + 22;
            this.ticker.scrollTo({ y: position, animated: true, duration: 500 });
            // After position passes this value, snaps back to beginning
            let maxOffset = (this.state.complete_orders.length - 6) * 22;

            // Set animation to repeat at end of scroll
            if (this.state.currentPosition > maxOffset) {
                this.ticker.scrollTo({ y: 0, animated: false })
                this.setState({ currentPosition: 0 });
            }
            else {
                this.setState({ currentPosition: position });
            }
        }
    }

    render() {
        return (
            <View style={styles.pageStyle} >
                <Image
                    source={require('../static/img/3.jpg')}
                    style={styles.backgroundStyle}
                />
                <SafeAreaView style={styles.pageContentStyle}>
                    <View style={styles.waitingAreaStyle}>
                        <Text style={styles.titleStyle}>Waiting List</Text>
                        <FlatList
                            columnWrapperStyle={styles.waitingItemStyle}
                            numColumns={4}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            style={styles.waitingListStyle}
                            extraData={this.props.orders}
                            data={this.props.orders[1].data}
                            renderItem={({ item, index }) =>
                                // <View style={styles.waitingItemStyle}>
                                <Text key={index} style={styles.waitingNumberStyle}>{item.order_uuid}</Text>
                                // </View>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={styles.inputAreaStyle}>
                        <View style={styles.textInputContainerStyle}>
                            <Icon style={styles.iconStyle} name="highlighter" size={20} color="#000000" />
                            <TextInput
                                autoCompleteType={'off'}
                                style={styles.textInputStyle}
                                onChangeText={(text) => this.updateOrderId(text)}
                                value={this.state.order_uuid}
                                placeholder={'Please enter your order id'}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={this.pickupOrder}
                        >
                            <Text style={styles.buttonTextStyle}>Pick Up</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.completeAreaStyle}>
                        <Text style={styles.titleStyle}>Complete List</Text>
                        <ScrollView
                            style={styles.completegListStyle}
                            // extraData={this.state}
                            ref={(ref) => this.ticker = ref}
                            bounces={false}
                        >
                            {this.state.complete_orders.map((item, index) => (
                                <Text key={index} style={styles.completeRowStyle}>Order {item.order_id} has been picked up!</Text>
                            ))}
                        </ScrollView>
                    </View> */}
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        alignItems: 'center'
    },
    backgroundStyle: {
        resizeMode: 'cover',
        flex: 1
    },
    pageContentStyle: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#545454'
    },
    titleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#0000ff',
        color: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    waitingAreaStyle: {
        flex: 1,
        width: '80%',
        alignSelf: 'center',
        // justifyContent: 'center',
        margin: 20,
    },
    waitingListStyle: {
        // display: 'flex',
        // flexWrap: 'wrap',
        // flexGrow: 0,
        // paddingHorizontal: 10,
        // marginTop: 10,
    },
    waitingItemStyle: {
        flex: 1,
        // alignSelf: 'stretch',
        justifyContent: 'space-around'
    },
    waitingNumberStyle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputAreaStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    textInputContainerStyle: {
        // flex: 1,
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
        // paddingBottom: 10,
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
    },
    completeAreaStyle: {
        flex: 1,
        width: '80%',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        margin: 20,
    },
    completegListStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 0,
        paddingHorizontal: 10,
        marginTop: 20,
        height: 110
    },
    completeRowStyle: {
        fontSize: 18,
        // color: '#fff'
    }
})

const mapStateToProps = state => {
    return {
        orders: state.orders
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchOrders, updateOrder }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(PickupScreen)