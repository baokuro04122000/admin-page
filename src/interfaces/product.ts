import {  CategoriesResponseDataInner, ProductsResponse, FileInfo, ProductDetails, OrderList, OrderListShipping} from "../api/openapi-generator";



export interface ProductSlice {
  categories: undefined | CategoriesResponseDataInner[];
  productImages: undefined | FileInfo[];
  products: undefined | ProductsResponse;
  product: undefined | ProductDetails;
  orders: undefined | OrderList;
  ordersShipping: undefined | OrderListShipping
}
