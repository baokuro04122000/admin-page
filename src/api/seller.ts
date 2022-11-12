import baseClient, { BASE_URL } from "./baseClient";
import { AddProductRequest, EditProductRequest, EditQuickProductRequest, SellerApiFactory } from "./openapi-generator";

const sellerApiFactory = SellerApiFactory(undefined, BASE_URL, baseClient);

export const addProduct = (product:AddProductRequest) => {
  return sellerApiFactory.sellerAddProductPost(product)
}

export const updateProduct = (product: EditProductRequest) => {
  return sellerApiFactory.sellerUpdateProductPut(product)
}

export const deleteProduct = (id: string) => {
  return sellerApiFactory.sellerDeleteProductIdDelete(id)
}

export const quickUpdateProduct = (product: EditQuickProductRequest) => {
  return sellerApiFactory.sellerQuickUpdateProductPut(product)
}
