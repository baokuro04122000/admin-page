import {
  VIEW_ADMIN,
  VIEW_ALL_CONTRACT_LIST,
  VIEW_CONTRACT_LIST,
} from "../constants/authorization";

export type Permission =
  | typeof VIEW_ALL_CONTRACT_LIST
  | typeof VIEW_CONTRACT_LIST
  | typeof VIEW_ADMIN;
