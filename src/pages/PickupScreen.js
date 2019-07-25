import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-root-toast';

class PickupScreen extends Component {

    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            order_id: null,
            orders: [{
                order_id: '12',
                order_products: [
                    {
                        name: 'fish',
                        quantity: 12,
                    },
                    {
                        name: 'vegetables',
                        quantity: 3,
                    },
                    {
                        name: 'others',
                        quantity: 1,
                    }
                ],
                order_time: '2019-06-30 12:00:00',
                pickup_time: '2019-06-31 11:12:12',
                order_status: 'Processing',
                comments: 'hello'
            }, {
                order_id: '13',
                order_products: [
                    {
                        name: 'meat',
                        quantity: 5,
                    },
                    {
                        name: 'meat2',
                        quantity: 31,
                    }
                ],
                order_time: '2019-06-30 14:00:00',
                pickup_time: '2019-06-31 9:12:12',
                order_status: 'Shipping',
                comments: 'hello2'
            }, {
                order_id: '15',
                order_products: [
                    {
                        name: 'fish',
                        quantity: 12,
                    },
                    {
                        name: 'vegetables',
                        quantity: 3,
                    },
                    {
                        name: 'others',
                        quantity: 1,
                    }
                ],
                comments: 'testing',
                order_time: '2019-06-30 12:00:00',
                pickup_time: '2019-06-31 11:12:12',
                order_status: 'Processing'
            }, {
                order_id: '18',
                order_products: [
                    {
                        name: 'meat',
                        quantity: 5,
                    },
                    {
                        name: 'meat2',
                        quantity: 31,
                    }
                ],
                comments: '',
                order_time: '2019-06-30 14:00:00',
                pickup_time: '2019-06-31 9:12:12',
                order_status: 'Complete'
            }, {
                order_id: '133',
                order_products: [
                    {
                        name: 'test',
                        quantity: 5,
                    }
                ],
                comments: '',
                order_time: '2019-06-30 14:00:00',
                pickup_time: '2019-06-31 9:12:12',
                order_status: 'Shipping'
            }, {
                order_id: '100',
                order_products: [
                    {
                        name: 'fish',
                        quantity: 12,
                    },
                    {
                        name: 'vegetables',
                        quantity: 3,
                    },
                    {
                        name: 'others',
                        quantity: 1,
                    }
                ],
                comments: '',
                order_time: '2019-06-30 12:00:00',
                pickup_time: '2019-06-31 11:12:12',
                order_status: 'Processing'
            }],
            complete_orders: [
                {
                    order_id: '100',
                    complete_time: '2019-06-31 13:12:12',
                }, {
                    order_id: '120',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '140',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '150',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '160',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '170',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '180',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '121',
                    complete_time: '2019-06-31 15:12:12',
                }, {
                    order_id: '331',
                    complete_time: '2019-06-31 15:12:12',
                }
            ],
            currentPosition: 0,
        }
        this.scrolling = this.scrolling.bind(this)
        this.showToast = this.showToast.bind(this)
    }

    updateOrderId = (val) => {
        this.setState({
            order_id: val
        })
    }

    componentDidMount() {
        this.activeInterval = setInterval(this.scrolling, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.activeInterval);
    }

    pickupOrder = () => {
        let in_list = this.state.orders.some(el => el.order_id == this.state.order_id)

        if (!in_list) {
            this.state.orders.push({ order_id: this.state.order_id, order_products: [] })
            this.showToast(true, 'Please come to pick up your order')
            this.state.order_id = null
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
                    source={require('../static/img/2.jpg')}
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
                            extraData={this.state}
                            data={this.state.orders}
                            renderItem={({ item, index }) =>
                                // <View style={styles.waitingItemStyle}>
                                <Text key={index} style={styles.waitingNumberStyle}>{item.order_id}</Text>
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
                                value={this.state.order_id}
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
                    <View style={styles.completeAreaStyle}>
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
                    </View>
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
        resizeMode: 'contain',
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
        alignSelf: 'flex-start',
        // justifyContent: 'center',
        margin: 20,
    },
    waitingListStyle: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 0,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    waitingItemStyle: {
        // alignSelf: 'stretch',
        // justifyContent: 'flex-start'
    },
    waitingNumberStyle: {
        flex: 0.25,
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

export default PickupScreen