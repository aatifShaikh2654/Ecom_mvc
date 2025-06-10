import axiosInstance from "../utils/axios-instance";

export const login = async (payload) => {
  try {
    const response = await axiosInstance.post('login', payload)
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post('register', payload)
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

export const updateProfile = async (payload) => {
  try {
    const response = await axiosInstance.put('profile', payload)
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

export const getProfile = async (params) => {
  try {
    const response = await axiosInstance.get('profile', { params: params })
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

export const getUsers = async (params) => {
  try {
    const response = await axiosInstance.get('users', { params: params })
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

export const verifyUser = async () => {
  try {
    const response = await axiosInstance.get('verify')
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.get('logout')
    return response.data
  } catch (error) {
    return error?.response?.data;
  }
}

