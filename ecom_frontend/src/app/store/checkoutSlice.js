import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

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
const saveToCookies = (data) => {
    const encryptedData = encryptData(data);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    cookies.set('checkout_hashData', encryptedData, {
        expires: expiryDate,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production",
    })
};

const saveSource = (data) => {
    const encryptedData = encryptData(data);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);

    cookies.set('checkout_source', encryptedData, {
        expires: expiryDate,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production",
    })
}

// Utility: Load from c
export const loadCheckout = createAsyncThunk(
    'checkout/loadCheckout',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const encryptedData = cookies.get('checkout_hashData');

            if (!encryptedData) {
                return []; // Return an empty array if no data is found
            }

            return decryptData(encryptedData); // Return decrypted data
        } catch (error) {
            console.error('Error loading data from cookies:', error);
            return rejectWithValue('Failed to load checkout data.');
        }
    }
);

const getCheckoutSource = () => {
    const encryptedData = cookies.get('checkout_source');
    if (!encryptedData) {
        return null; // Return an empty array if no data is found
    }
    return decryptData(encryptedData); // Return decrypted data
}
// Checkout slice
const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        items: [],
        source: getCheckoutSource(),
        total: 0,
    },
    reducers: {
        setCheckoutItems: (state, action) => {
            // state.items = action.payload;
            state.source = "cart"
            saveSource("cart")
            // saveToCookies(state.items);
        },

        addCheckoutItem: (state, action) => {
            state.source = "buynow"
            saveSource("buynow")
            state.items = action.payload
            saveToCookies(state.items);
        },

        removeCheckItem: (state, action) => {
            const id = action.payload;
            const item = state.items.find((item) => item.variant.id === id);
            state.items = state.items.filter((item) => item.variant.id !== id);
            state.total = state.total - item.variant.discounted_price * item.quantity
            saveToCookies(state.items);
        },

        increaseCheckQty: (state, action) => {
            const id = action.payload;
            const item = state.items.find((item) => item.variant.id === id);
            if (item) {
                item.quantity += 1;
                state.total = state.total + item.variant.discounted_price * 1
                saveToCookies(state.items);
            }
        },

        decreaseCheckQty: (state, action) => {
            const id = action.payload;
            const item = state.items.find((item) => item.variant.id === id);

            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    state.total = state.total - item.variant.discounted_price;
                } else {
                    // Optionally remove item if quantity reaches 0
                    state.items = state.items.filter((item) => item.id !== id);
                }
                saveToCookies(state.items);
            }
        },

        clearCheckout: (state) => {
            state.items = [];
            saveToCookies(state.items);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCheckout.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadCheckout.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(loadCheckout.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const {
    setCheckoutItems,
    addCheckoutItem,
    removeCheckItem,
    increaseCheckQty,
    decreaseCheckQty,
    clearCheckout,
} = checkoutSlice.actions;

export const selectCheckoutItems = (state) => state.checkout;

export default checkoutSlice.reducer;
