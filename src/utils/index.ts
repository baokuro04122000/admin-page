import { TablePaginationConfig } from "antd";
import { SorterResult } from "antd/lib/table/interface";
import { UserCredentialResponse } from "../api/openapi-generator";

import {
  RequestSearchParams,
  DefaultResponse,
  Query,
  FilterApiParams,
  FilterQuery,
} from "../interfaces/api";

export const responseToTablePagination = (
  response: DefaultResponse
): TablePaginationConfig => {
  const { limit, offset, total } = response;
  let current: number | undefined = undefined;
  if (offset !== undefined && limit !== undefined) {
    current = Math.floor(offset / limit) + 1;
  }
  return {
    total,
    pageSize: limit,
    current,
  };
};



export const ObjectToSearchParams = (query?: Query, parentObjKey?: string) => {
  if (!query) return undefined;
  let searchParams = new URLSearchParams();
  const _parentObjKey = parentObjKey ? parentObjKey + "." : "";
  for (const [rootKey, rootValue] of Object.entries(query)) {
    const appendKey = _parentObjKey + rootKey;
    if (typeof rootValue !== "object" || rootValue === null) {
      let appendValue;
      if (rootValue === null) {
        appendValue = "null";
      } else if (rootValue === undefined) {
        appendValue = "undefined";
      } else {
        appendValue = rootValue.toString();
      }
      searchParams.append(appendKey, appendValue);
    } else if (!Array.isArray(rootValue)) {
      const nestedObjParams = new URLSearchParams(
        ObjectToSearchParams(rootValue, appendKey)
      );
      searchParams = new URLSearchParams({
        ...Object.fromEntries(searchParams),
        ...Object.fromEntries(nestedObjParams),
      });
    } else {
      for (let i = 0; i < rootValue.length; i++) {
        const nestArrayParams = new URLSearchParams(
          ObjectToSearchParams({ [i]: rootValue[i] }, appendKey)
        );
        searchParams = new URLSearchParams({
          ...Object.fromEntries(searchParams),
          ...Object.fromEntries(nestArrayParams),
        });
      }
    }
  }

  return searchParams;
};

export const filterToSearchParams = (filters?: FilterQuery[]) => {
  if (!filters) return undefined;
  let searchParams = new URLSearchParams();

  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    const nestedParams = ObjectToSearchParams(filter, `filters.${i}`);
    if (!nestedParams) continue;
    searchParams = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      ...Object.fromEntries(nestedParams),
    });
  }

  return searchParams;
};

export const firstLetterUppercase = (text: string): string => {
  text.toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getAccessTokenFromLocalStorage = (name: string) => {
  const authData  = localStorage.getItem(name)
  if(!authData) return 
  const parsedUserData: UserCredentialResponse = JSON.parse(authData);
  return parsedUserData.access_token
}

export function getGoogleOAuthURL(){
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
  
  const options = {
    redirect_uri:`${process.env.REACT_APP_BASE_URL}/api/oauth/google`,
    client_id:"177322333542-5s78k6m5htmshg70qiprq450413qafts.apps.googleusercontent.com",
    access_type:"online",
    response_type:'code',
    prompt:"consent",
    scope:[
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(" "),
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts:any = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

