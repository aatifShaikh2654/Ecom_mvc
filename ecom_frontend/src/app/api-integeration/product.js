import axiosInstance from "../utils/axios-instance";

export const addProduct = async (payload) => {
    try {
        const response = await axiosInstance.post('product', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const updateProduct = async (payload) => {
    try {
        const response = await axiosInstance.put('product', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getProducts = async (params) => {
    try {
        console.log(params)
        const response = await axiosInstance.get('product', { params: params })
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getSingleProduct = async (slug) => {
    try {
        const response = await axiosInstance.get(`product/${slug}`)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`product/${id}`)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const addCategory = async (payload) => {
    try {
        const response = await axiosInstance.post('category', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const updateCategory = async (payload) => {
    try {
        const response = await axiosInstance.put('category', payload)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getCategory = async (params) => {
    try {
        const response = await axiosInstance.get('category')
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const getSingleCategory = async (slug) => {
    try {
        const response = await axiosInstance.get(`category/${slug}`)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}

export const deleteCategory = async (categoryId) => {
    try {
        const response = await axiosInstance.delete(`category?categoryId=${categoryId}`)
        return response.data
    } catch (error) {
        return error?.response?.data;
    }
}