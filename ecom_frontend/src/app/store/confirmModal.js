// store/confirmModal.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  title: '',
  description: '',
  onConfirm: null,
}

const confirmModal = createSlice({
  name: 'confirmModal',
  initialState,
  reducers: {
    openConfirmModal: (state, action) => {
      state.isOpen = true
      state.title = action.payload.title
      state.description = action.payload.description
      state.onConfirm = action.payload.onConfirm
    },
    closeConfirmModal: (state) => {
      state.isOpen = false
      state.title = ''
      state.description = ''
      state.onConfirm = null
    },
  },
})

export const { openConfirmModal, closeConfirmModal } = confirmModal.actions
export default confirmModal.reducer
