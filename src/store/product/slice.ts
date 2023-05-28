import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
 ProductsResponse, FileInfo, ProductDetails, OrderList, OrderListShipping, CategoriesResponse,
} from "../../api/openapi-generator";
import { ProductSlice } from "../../interfaces/product";

const initialState: ProductSlice = {
  categories: undefined,
  productImages: undefined,
  products: undefined,
  product: undefined,
  orders: undefined,
  ordersShipping: undefined,
  ordersDone: undefined,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<CategoriesResponse[] | undefined>) {
      state.categories = action.payload;
    },
    setProductImages(state, action: PayloadAction<string[] | undefined>){
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
    },
    setOrdersDone(state, action: PayloadAction<any>){
      state.ordersDone = action.payload
    }
  },
});

export const { 
  setCategories,
  setProductImages,
  setProducts,
  setProduct,
  setOrders,
  setOrdersShipping,
  setOrdersDone
} = productSlice.actions;

export default productSlice.reducer;
