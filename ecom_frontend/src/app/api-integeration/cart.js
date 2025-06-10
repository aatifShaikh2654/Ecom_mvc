import axiosInstance from "../utils/axios-instance";

export const addCart = async (payload) => {
    try {
        const response = await axiosInstance.post('cart', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const updateCart = async (payload) => {
    try {
        const response = await axiosInstance.put('cart', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getCart = async (params) => {
    try {
        const response = await axiosInstance.get('cart')
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const deleteCart = async (id) => {
    try {
        const response = await axiosInstance.delete(`cart?product=${id}`)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}