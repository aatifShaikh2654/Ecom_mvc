import axiosInstance from "../utils/axios-instance";

export const checkout = async (payload) => {
    try {
        const response = await axiosInstance.post('checkout', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getOrders = async (params) => {
    try {
        const response = await axiosInstance.get('orders', { params: params })
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getSingleOrder = async (id) => {
    try {
        const response = await axiosInstance.get(`order/${id}`)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getAllOrders = async (params) => {
    try {
        const response = await axiosInstance.get('all-orders', { params: params })
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}