import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  vendors: null,
  filters: null,
}

export const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendors: (state, action) => {
      state.vendors = action.payload
    },

    setFilterVendors: (state, action) => {
      state.filters = action.payload
    },
  },
})

export const { setVendors, setFilterVendors } = vendorSlice.actions

export const selectVendors = (state) => state.vendorSlice.vendors
export const selectFilters = (state) => state.vendorSlice.filters

export default vendorSlice.reducer
