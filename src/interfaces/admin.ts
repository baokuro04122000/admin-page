import { TablePaginationConfig } from "antd";
import { UserDetail } from "../api/openapi-generator";
import { UsersQuery } from "./api";

export interface AdminSlice {
  users: UserDetail[];
  usersLoading: boolean;
  usersPagination?: TablePaginationConfig;
  usersFilterEmail?: UsersQuery;
  usersFilterFullName?: UsersQuery;
}
