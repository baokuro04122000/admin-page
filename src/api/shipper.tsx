import baseClient, { BASE_URL } from "./baseClient";
import { ShipperApiFactory } from "./openapi-generator";

const shipperApiFactory = ShipperApiFactory(undefined, BASE_URL, baseClient);


export const  ordersShipping = (currentPage: number, limit: number) => {
  return shipperApiFactory.shipperAllOrdersShippingGet(currentPage, limit)
}

export const updateStatusOrderShipping = (orderId: string) => {
  return shipperApiFactory.shipperStatusOrderPut({orderId})
}