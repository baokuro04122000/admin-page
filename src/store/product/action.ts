import { AppThunk } from "..";
import { AxiosError } from "axios";
import { 
  setCategories,
  setProducts,
  setProduct
 } from './slice'
import { 
  getAllCategories,
  getProducts,
  getSingleProduct
} from '../../api/product'
import {
  addProduct,
  updateProduct,
  deleteProduct,
  quickUpdateProduct
} from '../../api/seller'
import { AddProductRequest, EditProductRequest, EditQuickProductRequest } from "../../api/openapi-generator";
import { notificationController } from '../../controllers/notificationController'
import { RequestSearchParams } from "../../interfaces/api";

export const actionGetAllCategories = ()
: AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const {data} = await getAllCategories()
      dispatch(setCategories(data.data))
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionAddProduct = (product: AddProductRequest)
: AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const {data} = await addProduct(product);
      return data.data?.message
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionGetProducts = (requestParams: RequestSearchParams)
: AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const {data} = await getProducts(requestParams);
      dispatch(setProducts(data))
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionGetSingleProduct = (slug: string)
: AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const {data} = await getSingleProduct(slug)
      dispatch(setProduct(data.data))
    } catch (error) {
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionUpdateProduct = (product: EditProductRequest)
: AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const {data} = await updateProduct(product)
      return data.data?.message
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionQuickEditProduct = (product: EditQuickProductRequest)
: AppThunk<Promise<string>> => {
  return async () => {
    try {
      const {data} = await quickUpdateProduct(product)
      return data.data?.message ? data.data.message : ''
    } catch (error:any) {
      console.log(error)
      notificationController.error({
        message: error ? error.response?.data.errors.message : '',
        duration: 5
      })
      throw error.response?.data;
    }
  }
}

export const actionDeleteProduct = (id: string)
: AppThunk<Promise<string | undefined>> => {
  return async () => {
    try {
      const {data} = await deleteProduct(id);
      return data.data?.message
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}