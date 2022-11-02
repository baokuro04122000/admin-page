import {  CategoriesResponseDataInner, ProductsResponse, FileInfo, ProductDetails} from "../api/openapi-generator";



export interface ProductSlice {
  categories: undefined | CategoriesResponseDataInner[];
  productImages: undefined | FileInfo[];
  products: undefined | ProductsResponse;
  product: undefined | ProductDetails;
}
