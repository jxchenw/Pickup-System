import React, { Component } from 'react';
import {
    View,
    ScrollView,
    RefreshControl,
    StyleSheet,
    Text,
    Button,
    FlatList,
    LayoutAnimation,
    Platform,
    UIManager,
    TouchableOpacity,
    Switch,
    Dimensions
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import { fetchOrders } from '../actions/merchant_action'
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';

class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            orders: [],
            orientation: this.isPortrait() ? 'portrait' : 'landscape',
            timeStamp: (new Date()).getTime()
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        // Event Listener for orientation changes
        Dimensions.addEventListener('change', () => {
            this.setState({
                orientation: this.isPortrait() ? 'portrait' : 'landscape'
            });
        });
    }

    static navigationOptions = {

    }

    componentDidMount = async () => {
        let user = await AsyncStorage.getItem('userinfo');
        if (!user) {
            this.props.navigation.navigate('Auth')
        }

        console.log(this.props.initOrders)

        let tempOrders = [
            {
                status: 'Pending',
                data: []
            }, {
                status: 'Processing',
                data: []
            }, {
                status: 'Complete',
                data: []
            }]
        if (this.props.initOrders.length) {
            for (let order of this.props.initOrders) {
                order.order_status == 'Pending' ?
                    tempOrders[0].data.push(order) :
                    order.order_status == 'Processing' ?
                        tempOrders[1].data.push(order) :
                        order.order_status == 'Complete' ?
                            tempOrders[2].data.push(order) : ''
            }
        }

        this.setState({
            orders: tempOrders
        })


        this.interval = setInterval(() => {
            this.countDown()
        }, 1000);
    }

    countDown() {
        var now = this.state.timeStamp,
            updateOrders = this.state.orders,
            timer

        for (var status of updateOrders) {
            for (var order of status.data) {
                timer = Number(order.pickup_time) - Number(now)
                order.timer = timer > 0 ? timer : 0
            }
        }

        this.setState({
            timeStamp: (new Date()).getTime(),
            orders: updateOrders
        });
    }

    // componentDidUpdate() {
    //     if (this.state.timer === 1) {
    //         clearInterval(this.interval);
    //     }
    // }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /**
    * Returns true if the screen is in portrait mode
    */
    isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };


    filterOrderStatus = (index) => {
        this.setState({
            selectedIndex: index
        })
    }

    _logoffAsync = async () => {
        try {
            await AsyncStorage.removeItem('userinfo')
        } catch (err) {
            console.log(err)
        }
        this.props.navigation.navigate('AuthLoading')
    }

    changeLayout = (order, index, status) => {
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // this.setState({
        //     expandedIndex: order_id == this.state.expandedIndex ? 0 : order_id
        // })

        let orders = this.state.orders

        if (status === 'Pending') {
            orders[0].data.splice(index, 1)
            orders[1].data.push(order)
        } else if (status === 'Processing') {
            orders[1].data.splice(index, 1)
        }
    }

    updateStatus = (area_key, order_key) => {
        this.setState(prevState => {
            let new_orders = Object.assign({}, prevState.orders);
            new_orders[area_key].data[order_key].order_status = new_orders[area_key].data[order_key].order_status !== 'Complete' ? 'Complete' : 'Processing';
            return { new_orders };
        })
    }

    fetchData = () => {

    }

    refreshOrders = () => {
        this.setState({ refreshing: true });
        fetchData().then(() => {
            this.setState({ refreshing: false });
        });
    }

    render() {

        if (this.state.orientation === 'portrait') {
            return (
                <Text>Please flap</Text>
            )
        } else {
            return (
                <View style={styles.flexOneStyle} >
                    <SafeAreaView style={styles.flexOneStyle}>
                        <ScrollView style={styles.profileLandStyle}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={this.state.refreshing}
                        //         onRefresh={this.refreshOrders}
                        //     />
                        // }
                        >

                            <View>
                                <Text style={styles.profileTitle}>Sunny Delivery System {this.props.initOrders.length}</Text>
                                <Icon style={styles.iconStyle} name="sign-out-alt" size={30} color="#000000" onPress={this._logoffAsync} />
                            </View>
                            {
                                this.state.orders.map((order, key) => (

                                    <View key={key} style={styles.flexOneStyle}>
                                        <Text style={styles.sectionTitle}>{order.status}</Text>
                                        <FlatList
                                            style={styles.sectionLandList}
                                            columnWrapperStyle={styles.sectionColumnStyle}
                                            numColumns={4}
                                            extraData={this.state}
                                            data={order.data}
                                            renderItem={({ item, index }) =>
                                                <View style={{
                                                    flex: 0.25,
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'center',
                                                    marginTop: 10,
                                                    padding: 4,
                                                    backgroundColor: item.timer ? '#0000ff' : '#ff3399',
                                                    color: '#ffffff',
                                                    shadowColor: '#000000',
                                                    shadowOffset: { width: 0, height: 1 },
                                                    shadowOpacity: 0.8,
                                                    shadowRadius: 2,
                                                    elevation: 5
                                                }}>
                                                    <View key={index}
                                                        style={{
                                                            display: 'flex',
                                                            flex: 1,
                                                            alignSelf: 'stretch',
                                                            paddingBottom: 7,
                                                        }}>

                                                        <TouchableOpacity activeOpacity={0.8} onPress={(order_id) => this.changeLayout(item, index, order.status)}>
                                                            <View style={styles.itemTitleStyle}>
                                                                <View style={styles.itemSubTitleStyle}>
                                                                    <Text style={styles.itemOrderIdStyle}>ORD#: {item.order_id}</Text>
                                                                    <Text style={styles.itemOrderIdStyle}>| {Math.floor(item.timer / 3600000) < 10 ? '0' + Math.floor(item.timer / 3600000) : Math.floor(item.timer / 3600000)}:
                                                                    {Math.floor(item.timer % 3600000 / 60000) < 10 ? '0' + Math.floor(item.timer % 3600000 / 60000) : Math.floor(item.timer % 3600000 / 60000)}:
                                                                    {Math.floor(item.timer % 3600000 % 60000 / 1000) < 10 ? '0' + Math.floor(item.timer % 3600000 % 60000 / 1000) : Math.floor(item.timer % 3600000 % 60000 / 1000)}</Text>
                                                                </View>
                                                                {/* <Switch
                                                                    style={styles.itemSwitchStyle} onValueChange={(area_key, order_key) => this.updateStatus(index, key)}
                                                                    value={item.order_status !== 'Complete' ? false : true} /> */}
                                                            </View>
                                                        </TouchableOpacity>


                                                        <View style={{
                                                            // height: this.state.expandedIndex != item.order_id ? 0 : null,
                                                            // overflow: 'hidden',
                                                            paddingHorizontal: 12,
                                                            paddingVertical: 8,
                                                        }}>
                                                            {
                                                                item.order_products.map((product, key) =>
                                                                    <View key={key} style={styles.itemContentLandStyle}>
                                                                        <View style={styles.itemRowLandStyle}>
                                                                            <Text style={styles.itemColLandStyle}>{product.quantity}</Text>
                                                                            <Text style={styles.itemColLandStyle}>{product.name}</Text>
                                                                        </View>
                                                                        {
                                                                            product.options &&
                                                                            Object.keys(product.options).map((key, index) =>
                                                                                <View key={key} style={styles.itemOptionRowLandStyle}>
                                                                                    <Text style={styles.itemOptionColLandStyle}></Text>
                                                                                    <Text style={styles.itemOptionColLandStyle}>{key} {product.options[key]}</Text>
                                                                                </View>
                                                                            )
                                                                        }
                                                                    </View>
                                                                )
                                                            }
                                                            <Text style={styles.itemInfoStyle}></Text>
                                                            {item.comments ? <Text style={styles.commentLandStyle}>Comments: {item.comments}</Text> : <Text></Text>}
                                                        </View>



                                                    </View>

                                                </View>
                                            }
                                            keyExtractor={(item, index) => index.toString()
                                            }
                                        />
                                        <View style={styles.sectionDividerStyle}></View>
                                    </View>
                                ))
                            }
                        </ScrollView >
                    </SafeAreaView>
                </View>
            )
        }
    }
}

var styles = StyleSheet.create({
    flexOneStyle: {
        flex: 1,
    },
    profile: {
        flex: 1,
        display: 'flex',
    },
    profileTitle: {
        fontSize: 26,
        alignSelf: 'center',
        fontWeight: '600',
        fontFamily: 'Gill Sans',
        marginVertical: 4,
    },
    profileFilterContainer: {
        // flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 12
    },
    profileActiveTab: {
        color: '#ffffff',
        backgroundColor: '#3333cc'
    },
    profileFilter: {
        transform: [{ scaleX: .8 }, { scaleY: .8 }]
    },
    iconStyle: {
        position: 'absolute',
        right: 0
    },
    sectionList: {
        // flex: 1,
        paddingVertical: 4,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6,
        color: '#999999'
    },
    sectionContainerStyle: {
        flex: 0.25,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: 10,
    },
    itemTitleStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        padding: 4,
        backgroundColor: '#33ccff',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: '#ddd',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5
    },
    itemSubTitleStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemIconStyle: {
        marginRight: 8
    },
    itemOrderIdStyle: {
        fontSize: 16,
    },
    itemSwitchStyle: {
        // marginLeft: 12,
        alignSelf: 'flex-end'
    },
    itemContentStyle: {
        // flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginHorizontal: 8,
        paddingVertical: 6,
        borderBottomWidth: 0.25,
        borderColor: '#000000'
    },
    itemContentLastStyle: {
        // flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        marginHorizontal: 8,
        paddingVertical: 6,
        borderColor: '#000000'
    },
    itemCellStyle: {
        flex: 1,
        alignSelf: 'stretch'
    },
    itemInfoStyle: {
        marginTop: 6,
    },

    /**
     * Land Mode
     */
    pageContainerStyle: {
        flex: 1
    },
    profileLandStyle: {
        flex: 1,
        display: 'flex',
    },
    sectionLandList: {
        flex: 1,
        paddingVertical: 4,
        // marginLeft: 30,
        // paddingHorizontal: 2
    },
    sectionColumnStyle: {
        flex: 1,
        // width: '100%'
    },
    itemContentLandStyle: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 0.75,
        borderColor: '#add8e6',
        // color: '#fff'
    },
    sectionDividerStyle: {
        borderBottomWidth: 1,
        borderColor: '#000000',
        marginBottom: 10,
    },
    itemRowLandStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    itemOptionRowLandStyle: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    itemColLandStyle: {
        flex: 1,
        display: 'flex',
        marginLeft: 'auto',
        fontWeight: 'bold',
        color: '#fff'
    },
    itemOptionColLandStyle: {
        flex: 1,
        display: 'flex',
        marginLeft: 'auto',
        color: 'red',
        fontWeight: 'bold'
    },
    commentLandStyle: {
        flex: 1,
        display: 'flex',
        color: '#fff'
    },
})

const mapStateToProps = state => {
    return {
        initOrders: state.orders
    }
};

// const mapDispatchToProps = dispatch => {
//     return bindActionCreators({ getOrders: fetchOrders }, dispatch)
// }

export default connect(mapStateToProps, null)(HomeScreen)