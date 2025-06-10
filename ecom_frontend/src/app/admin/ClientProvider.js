'use client'
import React from 'react'
import { Provider } from 'react-redux'
import store from '@/app/store'
import ConfirmModal from './components/ConfirmModal'

const ClientProvider = ({children}) => {
    return (
        <Provider store={store}>
            <ConfirmModal />
            {children}
        </Provider>
    )
}

export default ClientProvider
