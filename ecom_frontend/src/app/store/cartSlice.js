'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { loader } from './loaderSlice';
import CryptoJS from 'crypto-js';
import secureLocalStorage from "react-secure-storage";
import { setRedirect } from './redirectSlice';
import { addCart, deleteCart, getCart, updateCart } from '../api-integeration/cart';
import { toast } from '@/lib/toast';

const cookies = new Cookies();
const url = process.env.API_URL;

const SECRET_KEY = process.env.COOKIE_SECRET || 'default_secret_key';

// Utility: Encrypt data
const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};
// Utility: Decrypt data
const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption failed:', error);
        return [];
    }
};

// Utility: Save to cookies
const saveToSession = (data) => {
    const encryptedData = encryptData(data);
    secureLocalStorage.setItem("cart_hashData", encryptedData)
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
    const token = cookies.get('token');

    if (!token) {
        const encodedData = secureLocalStorage.getItem("cart_hashData")
        const data = decryptData(encodedData)
        console.log(data)
        return data.length > 0 ? data : []
    } else {
        try {
            const json = await getCart();
            if (json.success) {
                return json.data; // Return the user data
            } else {
                toast.error(json.message || 'Failed to fetch user');
            }
        } catch (error) {
            console.error('Internal server error:', error);
        }
    }
});

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ quantity, data }, { rejectWithValue, dispatch, getState }) => {
        dispatch(loader(true))
        const token = cookies.get('token');
        const prod_id = data._id

        if (!token) {
            try {

                const state = getState();
                let cartItems = state.cart.cart; // Assuming cart items are stored in `state.cart.items`

                const isItemInCart = cartItems.some(item => item.product._id === prod_id);
                if (isItemInCart) {
                    await dispatch(increaseQty({ id: prod_id, quantity: quantity })); // Call increaseQty if item exists in the cart
                    dispatch(cartDrawer(true))
                    return rejectWithValue('Item quantity increased');
                }


                const finalData = [...cartItems, { product: data, quantity: quantity }]
                saveToSession(finalData)
                toast.success("Product Added To Cart")
                return { product: data, quantity: quantity };

            } catch (error) {
                console.log(error);
            } finally {
                dispatch(loader(false))
            }
        } else {
            try {

                const state = getState();
                const cartItems = state.cart.cart; // Assuming cart items are stored in `state.cart.items`

                // Check if the item is already in the cart
                if (cartItems) {
                    const isItemInCart = cartItems.some(item => item.product._id === prod_id);
                    if (isItemInCart) {
                        await dispatch(increaseQty({ id: prod_id, quantity: quantity })); // Call increaseQty if item exists in the cart
                        dispatch(cartDrawer(true))
                        return rejectWithValue('Item quantity increased');
                    }
                }

                const json = await addCart({ product: data?._id, quantity })
                if (json.success) {
                    // If the API call is successful, add a success toast and return the cart
                    toast.success(json.message)
                    return json.data;
                } else {
                    // Handle other failure cases
                    toast.error(json.message)
                    dispatch(setRedirect(`/login/`)); // Set redirect to Dashboard
                    return rejectWithValue(json.message || 'Unknown error occurred');
                }
            } catch (error) {
                toast.error(error.message)
                return rejectWithValue(error.message);
            } finally {
                dispatch(loader(false))
            }
        }
    }
);

export const increaseQty = createAsyncThunk(
    'cart/increaseQty',
    async ({ id, quantity }, { rejectWithValue, dispatch, getState }) => {
        dispatch(loader(true))
        const token = cookies.get('token');

        if (!token) {
            try {

                const state = getState();
                let cartItems = state.cart.cart; // Assuming cart items are stored in `state.cart.items`
                const updatedCart = cartItems.map(item => {
                    if (item.product._id === id) {
                        return { ...item, quantity: item.quantity + quantity }; // Increase quantity
                    }
                    return item;
                });

                saveToSession(updatedCart)
                return { id, quantity, success: true };

            } catch (error) {
                console.log(error);
            } finally {
                dispatch(loader(false))
            }
        } else {
            try {
                const json = await updateCart({ product: id, quantity, type: "increase" })
                if (json.success) {
                    return { id, quantity, success: true };
                } else {
                    dispatch(setRedirect(`/login/`)); // Set redirect to Dashboard
                    toast.error(json.message)
                }
            } catch (error) {
                toast.error(json.message)
                return rejectWithValue(error.message);
            } finally {
                dispatch(loader(false))
            }
        }
    }
);

export const decreaseQty = createAsyncThunk(
    'cart/decreaseQty',
    async (id, { rejectWithValue, dispatch, getState }) => {
        dispatch(loader(true))
        const token = cookies.get('token');


        if (!token) {
            try {

                const state = getState();
                let cartItems = state.cart.cart; // Assuming cart items are stored in `state.cart.items`
                let updatedCart = cartItems.map(item => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 }; // Increase quantity
                    }
                    return item;
                });

                saveToSession(updatedCart)
                return { id, success: true };

            } catch (error) {
                console.log(error);
            } finally {
                dispatch(loader(false))
            }
        } else {
            try {
                const json = await updateCart({ product: id, type: "decrease" })
                if (json.success) {
                    return { id, success: true };
                } else {
                    dispatch(setRedirect(`/login/`)); // Set redirect to Dashboard
                    toast.error(json.message)
                }
            } catch (error) {
                toast.error(error.message)
                return rejectWithValue(error.message);
            } finally {
                dispatch(loader(false))
            }
        }


    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (id, { rejectWithValue, dispatch, getState }) => {
        dispatch(loader(true))
        const token = cookies.get('token');

        if (!token) {
            try {

                const state = getState();
                let cartItems = state.cart.cart; // Assuming cart items are stored in `state.cart.items`
                const updatedCart = cartItems.filter((item) => item.product._id !== id);

                saveToSession(updatedCart)
                return { id, success: true };

            } catch (error) {
                console.log(error);
            } finally {
                dispatch(loader(false))
            }
        } else {
            try {
                const json = await deleteCart(id)
                if (json.success) {
                    toast.success(json.message)
                    return { id, success: true };
                } else {
                    toast.error(json.message)
                }
            } catch (error) {
                toast.success(json.message)
                return rejectWithValue(error.message);
            } finally {
                dispatch(loader(false))
            }
        }


    }
);

// Slice
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        total: 0,
        status: 'idle',
        error: null,
        openCart: false,
    },
    reducers: {
        cartDrawer: (state, action) => {
            state.openCart = action.payload;
        },
        setCartItems: (state, action) => {
            state.cart = action.payload
        },
        setTotal: (state, action) => {
            state.total = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.cart = action.payload === "undefined" ? [] : action.payload;
                state.total = action.payload ? action.payload.reduce((total, item) => total + item.product.price * item.quantity, 0) : 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(addToCart.fulfilled, (state, action) => {
                state.cart.push(action.payload);
                state.total = state.total + action.payload.product.price * action.payload.quantity
                state.openCart = true;
            })
            .addCase(increaseQty.fulfilled, (state, action) => {
                const item = state.cart.find((item) => item.product._id === action.payload.id);
                if (item) {
                    item.quantity += action.payload.quantity;
                    state.total = state.total + JSON.parse(item.product.price) * action.payload.quantity
                }
            })
            .addCase(decreaseQty.fulfilled, (state, action) => {
                const item = state.cart.find((item) => item.product._id === action.payload.id);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    state.total = state.total - JSON.parse(item.product.price)
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const item = state.cart.find((item) => item.product._id === action.payload.id);
                if (item) {
                    state.cart = state.cart.filter((item) => item.product._id !== action.payload.id);
                    state.total = state.total - item.product.price * item.quantity
                }
            });
    },
});

// Export actions
export const { cartDrawer, setCartItems, setTotal } = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart;
export const selectCartStatus = (state) => state.status;
export const selectCartError = (state) => state.error;

// Reducer
export default cartSlice.reducer;