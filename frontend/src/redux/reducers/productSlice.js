import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: null,
}

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload
    },
  },
})

export const { setProducts } = productSlice.actions

export const selectProducts = (state) => state.productSlice.products

export default productSlice.reducer
