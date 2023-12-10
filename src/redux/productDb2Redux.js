import { createSlice } from "@reduxjs/toolkit";

const productDb2Slice = createSlice({
  name: "product_db2",
  initialState: {
    products: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    getProductDB2Start: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    getProductDB2Success: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
    },
    getProductDB2Failure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    //delete
    deleteProductDB2Start: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    deleteProductDB2Success: (state, action) => {
      state.isFetching = false;
      state.products.splice(
        state.products.findIndex((item) => item._id === action.payload),
        1
      );
    },
    deleteProductDB2Failure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    //[update]
    updateProductDB2Start: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    updateProductDB2Success: (state, action) => {
      state.isFetching = false;
      state.products[state.products.findIndex((item) => item._id === action.payload.id)] = action.payload.product;
    },
    updateProductDB2Failure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
     //[add]
     addProductDB2Start: (state) => {
        state.isFetching = true;
        state.error = false;
      },
      addProductDB2Success: (state, action) => {
        state.isFetching = false;
        state.products.push(action.payload)
      },
      addProductDB2Failure: (state) => {
        state.isFetching = false;
        state.error = true;
      },
  },
});

export const {
  getProductDB2Start,
  getProductDB2Success,
  getProductDB2Failure,
  deleteProductDB2Failure,
  deleteProductDB2Start,
  deleteProductDB2Success,
  updateProductDB2Failure,
  updateProductDB2Start,
  updateProductDB2Success,
  addProductDB2Failure ,
  addProductDB2Start,
  addProductDB2Success 
} = productDb2Slice.actions;
export default productDb2Slice.reducer;