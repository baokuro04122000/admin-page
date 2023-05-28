import baseClient, { BASE_URL } from "./baseClient";
import { ShipperApiFactory } from "./openapi-generator";

const shipperApiFactory = ShipperApiFactory(undefined, BASE_URL, baseClient);


export const  ordersShipping = (currentPage: number, limit: number) => {
  return shipperApiFactory.orderShipperGetOrderGet(currentPage, limit)
}

export const updateStatusOrderShipping = (orderId: string) => {
  return shipperApiFactory.orderShipperUpdateOrderPut({orderItemId: orderId})
}

export const cancelOrderShipping = (orderId: string, reason: string) => {
  return shipperApiFactory.orderShipperCancelOrderPut({orderItemId: orderId, reason: reason})
}

export const rejectOrderShipping = (orderId: string, reason: string) => {
  return shipperApiFactory.orderShipperRejectOrderPut({orderItemId: orderId, reason: reason})
}