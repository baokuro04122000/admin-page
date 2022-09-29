import { TablePaginationConfig } from "antd";
import { ContractsQuery } from "./api";

export interface ContractsSlice {
  contracts: [];
  contractsLoading: boolean;
  contractsPagination?: TablePaginationConfig;
  contractsFilterActualAmount?: ContractsQuery;
  contractsFilterCode?: ContractsQuery;
}
