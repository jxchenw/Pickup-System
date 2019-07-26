import axios from 'axios'
import * as MERCHANT from '../constants/index'

export const fetchOrdersBegin = () => ({
    type: MERCHANT.FETCH_ORDERS
});

export const fetchOrdersSuccess = orders => ({
    type: MERCHANT.FETCH_ORDERS_SUCCESS,
    payload: { orders }
});

export const fetchOrdersFailure = error => ({
    type: MERCHANT.FETCH_ORDERS_FAIL,
    payload: { error }
});

export const updateOrdersBegin = () => ({
    type: MERCHANT.UPDATE_ORDERS
});

export const updateOrdersSuccess = is_success => ({
    type: MERCHANT.UPDATE_ORDERS_SUCCESS,
    payload: { is_success }
});

export const updateOrdersFailure = error => ({
    type: MERCHANT.UPDATE_ORDERS_FAIL,
    payload: { error }
});

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrdersBegin());
        return axios.post('http://www.sunnysupermarket.com/sunny/admin/index.php?route=delivery/order/getList')
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    dispatch(fetchOrdersFailure(response.statusText))
                } else {
                    console.log(response)
                    dispatch(fetchOrdersSuccess(response.data.orders));
                }
                return response.data.orders;
            })
            .catch(error => dispatch(fetchOrdersFailure(error)));
    };
}

export const updateOrder = (order_uuid, order_status) => {
    return dispatch => {
        dispatch(updateOrdersBegin());
        return axios.post('http://www.sunnysupermarket.com/sunny/admin/index.php?route=delivery/order/updateOrderStatus', {
            params: {
                order_uuid, order_status
            }
        })
            .then(response => {
                console.log(order_uuid)
                console.log(order_status)
                console.log(response)
                dispatch(updateOrdersSuccess(response.data));
                return response.data
            })
            .catch(error => dispatch(updateOrdersFailure(error)));
    };
}