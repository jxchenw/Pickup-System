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
    type: MERCHANT.FETCH_ORDERS_FAILURE,
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
                    dispatch(fetchOrdersSuccess(response.data));
                }
                return response.data;
            })
            .catch(error => dispatch(fetchOrdersFailure(error)));
    };
}

// export const fetchOrders = () => {
//     return dispatch => {
//         return axios.get('https://jsonplaceholder.typicode.com/posts')
//             .then(response => {
//                 dispatch({
//                     type: MERCHANT.FETCH_ORDERS,
//                     orders: response.data
//                 })
//             })
//             .catch(error => {
//                 console.log(error)
//                 // throw (error);
//             });
//     };
// }