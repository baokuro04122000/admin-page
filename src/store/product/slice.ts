import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CategoriesResponseDataInner, ProductsResponse, FileInfo, ProductDetails, OrderList, OrderListShipping,
} from "../../api/openapi-generator";
import { ProductSlice } from "../../interfaces/product";

const initialState: ProductSlice = {
  categories: undefined,
  productImages: undefined,
  products: undefined,
  product: undefined,
  orders: undefined,
  ordersShipping: undefined
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<CategoriesResponseDataInner[] | undefined>) {
      state.categories = action.payload;
    },
    setProductImages(state, action: PayloadAction<FileInfo[] | undefined>){
      state.productImages = action.payload
    },
    setProducts(state, action: PayloadAction<ProductsResponse | undefined>){
      state.products = action.payload
    },
    setProduct(state, action: PayloadAction<ProductDetails | undefined>){
      state.product = action.payload
    },
    setOrders(state, action: PayloadAction<OrderList | undefined>){
      state.orders = action.payload
    },
    setOrdersShipping(state, action: PayloadAction<OrderListShipping | undefined>){
      state.ordersShipping = action.payload
    }
  },
});

export const { 
  setCategories,
  setProductImages,
  setProducts,
  setProduct,
  setOrders,
  setOrdersShipping
} = productSlice.actions;

export default productSlice.reducer;
