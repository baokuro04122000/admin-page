import baseClient, { BASE_URL } from "./baseClient";
import { RequestSearchParams } from '../interfaces/api';
import {  ProductApiFactory } from "./openapi-generator";

const productApiFactory = ProductApiFactory(undefined, BASE_URL, baseClient);

export const getAllCategories = () => {
  return productApiFactory.categoryAllGet()
}

export const getProducts = ({
  limit, 
  page, 
  name,
  sellerId,
  category,
  priceGt,
  priceGte,
  priceLt,
  priceLte
}: RequestSearchParams) => {
  return productApiFactory.productListGet(
    name, 
    limit, 
    sellerId, 
    category,
    page,
    priceGte,
    priceGt,
    priceLte,
    priceLt)
}

export const getSingleProduct = (slug: string) => {
  return productApiFactory.productSlugGet(slug)
}

export const getProductsByCategoryName = (categoryName: string, limit: number, sellerId: string, page: number) => {
  return productApiFactory.productCategorySearchGet(categoryName, limit, sellerId, page);
}



