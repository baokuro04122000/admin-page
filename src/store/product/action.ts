import { AppThunk } from "..";
import { AxiosError } from "axios";
import {
  setCategories,
  setProducts,
  setProduct,
  setOrders,
  setOrdersShipping,
} from "./slice";
import {
  getAllCategories,
  getProducts,
  getProductsByCategoryName,
  getSingleProduct,
} from "../../api/product";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  orderList,
  updateStatusOrder,
  cancelOrderBySeller,
} from "../../api/seller";
import { ordersShipping, updateStatusOrderShipping } from "../../api/shipper";
import { AddProductRequest } from "../../api/openapi-generator";
import { notificationController } from "../../controllers/notificationController";
import { RequestSearchParams } from "../../interfaces/api";

export const actionGetAllCategories = (): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const { data } = await getAllCategories();
      dispatch(setCategories(data.data));
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionAddProduct = (
  product: AddProductRequest
): AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const { data } = await addProduct(product);
      return data.message;
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionGetProducts = (
  requestParams: RequestSearchParams
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const { data } = await getProducts(requestParams);
      console.log("data:::", data);
      dispatch(setProducts(data));
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionGetProductsByCategoryName = (
  categoryName: string,
  limit: number,
  sellerId: string,
  page: number
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const { data } = await getProductsByCategoryName(
        categoryName,
        limit,
        sellerId,
        page
      );
      console.log("check::", data);
      dispatch(setProducts(data));
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionGetSingleProduct = (
  slug: string
): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const { data } = await getSingleProduct(slug);
      dispatch(setProduct(data.data));
    } catch (error) {
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionUpdateProduct = (
  slug: string,
  product: AddProductRequest
): AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const { data } = await updateProduct(slug, product);
      return data.message;
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionDeleteProduct = (
  id: string
): AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const { data } = await deleteProduct(id);
      return data.message;
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionGetOrderList = (pagination: {
  currentPage: number;
  limit: number;
}): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    const { currentPage, limit } = pagination;
    try {
      const { data } = await orderList(currentPage, limit);
      const res = data as any;
      dispatch(setOrders(res.data));
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionUpdateStatusOrder = (
  orderId: string
): AppThunk<Promise<boolean>> => {
  return async () => {
    try {
      const { data } = await updateStatusOrder(orderId);
      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionOrderListShipping = (pagination: {
  currentPage: number;
  limit: number;
}): AppThunk<Promise<void>> => {
  return async (dispatch) => {
    const { currentPage, limit } = pagination;
    try {
      const { data } = await ordersShipping(currentPage, limit);
      dispatch(setOrdersShipping(data));
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionUpdateStatusOrderShipping = (
  orderId: string
): AppThunk<Promise<boolean>> => {
  return async () => {
    try {
      await updateStatusOrderShipping(orderId);
      return true;
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};

export const actionCancelOrderBySeller = (
  orderItemId: string,
  reason: string
): AppThunk<Promise<string>> => {
  return async () => {
    try {
      const { data } = await cancelOrderBySeller(orderItemId, reason);
      return data.message as string;
    } catch (error) {
      console.log(error);
      const err = error as AxiosError;
      throw err.response?.data;
    }
  };
};
