import {  ProductsResponse, FileInfo, ProductDetails, OrderList, OrderListShipping} from "../api/openapi-generator";



export interface ProductSlice {
  categories: undefined | any;
  productImages: undefined | string[];
  products: any;
  product: any;
  orders: undefined | OrderList;
  ordersShipping: undefined | OrderListShipping
}
