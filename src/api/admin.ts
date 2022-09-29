
import { AUTH_USER_DATA_LS_ITEM } from "../constants/authentication";
import { FilterApiParams, CreateUserApiParams } from "../interfaces/api";
import { filtersToRequest, getAccessTokenFromLocalStorage } from "../utils";
import baseClient, { BASE_URL } from "./baseClient";
import { Configuration} from "./openapi-generator";