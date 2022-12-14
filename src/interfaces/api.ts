import { TablePaginationConfig } from "antd";
import { SorterResult } from "antd/lib/table/interface";

export interface DefaultResponse {
  offset?: number;
  limit?: number;
  total?: number;
  list?: unknown[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Query = { [key: string]: any };

export interface UsersQuery extends FilterQuery {
  key: "email" | "full_name";
  value: string;
}

export interface ContractsQuery extends FilterQuery {
  key: "actual_amount" | "code";
  value: string | number;
}

export interface RequestSearchParams {
  keyword?: string;
  limit?: number;
  priceGte?: number;
  priceGt?: number;
  priceLte?: number;
  priceLt?: number;
  sellerId?: string;
  category?: string;
  currentPage?: number;
}

export interface FilterApiParams<T> {
  pagination?: TablePaginationConfig;
  query?: FilterQuery[];
  sort?: SorterResult<T>;
}

export interface FilterQuery {
  key: string;
  operator: "like" | "eq" | "ne" | "lt" | "le" | "gt" | "ge";
}

export interface CreateUserApiParams<T> {
  full_name: string,
  email: string,
  roles: Array<T>
}
