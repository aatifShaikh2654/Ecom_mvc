import axiosInstance from "../utils/axios-instance";

export const getRevenue = async (params) => {
    try {
        const response = await axiosInstance.get('revenue-reports', { params: params })
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}


export const getTopSpenders = async (params) => {
    try {
        const response = await axiosInstance.get('top-spenders', { params: params })
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}


export const getTopUsers = async (params) => {
    try {
        const response = await axiosInstance.get('top-spend-users', { params: params })
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}
