import { AxiosError } from "axios";
import { AppThunk } from "..";
import { addCategory, blockUser, editCategory, forceUserLogout, getUserList, unBlockUser } from "api/admin";
import { CategoryRequest } from "api/openapi-generator";
import { setUserList } from "./slice";

export const actionAddCategory = (category: CategoryRequest)
: AppThunk<Promise<any>> => {
  return async (dispatch) => {
    try {
      const {data} = await addCategory(category);
      return data.data
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionEditCategory = (slug: string, category: CategoryRequest)
: AppThunk<Promise<string>> => {
  return async () => {
    try {
      const {data} = await editCategory(slug,category);
      return data.message as string
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionGetUserList = ()
: AppThunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const {data} = await getUserList();
      console.log('users:::', data)
      dispatch(setUserList(data.data))
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionForceUserLogout = (userId: string)
: AppThunk<Promise<string>> => {
  return async (dispatch) => {
    try {
      const {data} = await forceUserLogout(userId);
      return data.message as string
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionBlockUser = (userId: string)
: AppThunk<Promise<string>> => {
  return async () => {
    try {
      const {data} = await blockUser(userId);
      return data.message as string
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}

export const actionUnBlockUser = (userId: string)
: AppThunk<Promise<string>> => {
  return async () => {
    try {
      const {data} = await unBlockUser(userId);
      return data.message as string
    } catch (error) {
      console.log(error)
      const err = error as AxiosError
      throw err.response?.data;
    }
  }
}