import baseClient, { BASE_URL } from "./baseClient";
import { AddProductRequest, SellerApiFactory } from "./openapi-generator";

const sellerApiFactory = SellerApiFactory(undefined, BASE_URL, baseClient);

export const addProduct = (product:AddProductRequest) => {
  return sellerApiFactory.productAddPost(product)
}

export const updateProduct = (slug: string,product: AddProductRequest) => {
  return sellerApiFactory.productUpdatePut(slug, product)
}

export const deleteProduct = (id: string) => {
  return sellerApiFactory.productDeleteIdDelete(id)
}

export const orderList = (currentPage: number, limit: number) => {
  return sellerApiFactory.sellerOrdersProcessingGet(currentPage, limit)
}

export const updateStatusOrder = (orderId: string) => {
  return sellerApiFactory.sellerStatusOrderPut({orderId})
}