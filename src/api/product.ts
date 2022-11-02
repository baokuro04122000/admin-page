import baseClient, { BASE_URL } from "./baseClient";
import { RequestSearchParams } from '../interfaces/api';
import {  ProductApiFactory } from "./openapi-generator";

const productApiFactory = ProductApiFactory(undefined, BASE_URL, baseClient);

export const getAllCategories = () => {
  return productApiFactory.categoriesGet()
}

export const getProducts = ({
  limit, 
  currentPage, 
  keyword,
  sellerId,
  category,
  priceGt,
  priceGte,
  priceLt,
  priceLte
}: RequestSearchParams) => {
  return productApiFactory.productsGet(
    keyword, 
    limit, 
    sellerId, 
    category,
    currentPage,
    priceGte,
    priceGt,
    priceLte,
    priceLt)
}

export const getSingleProduct = (slug: string) => {
  return productApiFactory.productSlugGet(slug)
}



