import { TablePaginationConfig } from "antd";
import { UsersQuery } from "./api";

export interface AdminSlice {
  users: any[];
  usersLoading: boolean;
  usersPagination?: TablePaginationConfig;
  usersFilterEmail?: UsersQuery;
  usersFilterFullName?: UsersQuery;
}
