import baseClient, { BASE_URL } from "./baseClient";
import { AdminApiFactory, CategoryRequest } from "./openapi-generator";

const adminApiFactory = AdminApiFactory(undefined, BASE_URL, baseClient);


export const  addCategory = (category: CategoryRequest) => {
  return adminApiFactory.categoryAddPost(category)
}

export const editCategory = (slug: string, category: CategoryRequest) => {
  return adminApiFactory.categoryEditPut(slug, category)
}

export const getUserList = () => {
  return adminApiFactory.adminUserAllGet()
}

export const forceUserLogout = (userId: string) => {
  return adminApiFactory.adminUserLogoutPost({userId})
}

export const blockUser = (userId: string) => {
  return adminApiFactory.adminUserBlockPut({userId})
}

export const unBlockUser = (userId: string) => {
  return adminApiFactory.adminUserUnblockPut({userId})
}