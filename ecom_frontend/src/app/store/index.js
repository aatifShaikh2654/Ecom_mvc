// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import confirmModalReducer from './confirmModal'
import loaderSlice from './loaderSlice'
import cartSlice from './cartSlice'
import redirectReducer from './redirectSlice'
import checkoutReducer from './checkoutSlice'

const store = configureStore({
  reducer: {
    confirmModal: confirmModalReducer,
    loader: loaderSlice,
    cart: cartSlice,
    redirect: redirectReducer,
    checkout: checkoutReducer
  },
})

export default store;
