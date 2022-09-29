import React from 'react'
import { Navigate, Outlet, Route, Routes as ReactRoutes } from "react-router-dom";
import {
  VIEW_ADMIN,
} from "../constants/authorization";
import {
  ADMIN_HOME_SUBPATH,
  ADMIN_PATH,
  ADMIN_UNAUTHORIZED_SUBPATH,
  ADMIN_USERS_SUBPATH,
  LOGIN_SUBPATH,
  AUTH_PATH,
  SEND_EMAIL_SUBPATH,
  RESET_PASSWORD_SUBPATH,
  ACTIVATE_PASSWORD_SUBPATH,
  SELLER_DASHBOARD_PATH,
  SELLER_DASHBOARD_HOME_SUBPATH,
  SELLER_DASHBOARD_PRODUCTS_SUBPATH,
  SELLER_DASHBOARD_UNAUTHORIZED_SUBPATH

} from "../constants/routes";

import { RouteConfig } from "../interfaces/routes";
import Layout from "../layout/MainLayout/MainLayout";
import AuthRoute from "./AuthRoute";
import UnauthRoute from "./UnauthRoute";
import PermissionRoute from "./PermissionRoute";
const AuthLayout = React.lazy(() => import("../layout/AuthLayout/AuthLayout")) 
const ResetPassword = React.lazy(()=>import("../pages/ResetPassword")) ;
const ActivatePassWord = React.lazy(() => import("../pages/ActivateAccount"));
const Login = React.lazy(() => import("../pages/Login"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const Unauthorized = React.lazy(() => import("../pages/Unauthorized"));
const ResetPassWordForm = React.lazy(() => import("../pages/ResetPassword/ResetPassWordForm"));


const unauthRoutes: RouteConfig = {
  path: AUTH_PATH,
  element: <AuthLayout />,
  guard: <UnauthRoute />,
  children :[
    {
      path:LOGIN_SUBPATH,
      element: <Login/>
    },
    {
      path: SEND_EMAIL_SUBPATH,
      element:<ResetPassword/>
    },
    {
      path: RESET_PASSWORD_SUBPATH,
      element: <ResetPassWordForm/>
    },
    {
      path: ACTIVATE_PASSWORD_SUBPATH,
      element: <ActivatePassWord/>
    }
  ]
};

const adminRoutes: RouteConfig = {
  path: ADMIN_PATH,
  guard: <AuthRoute />,
  element: <Layout page="admin"/>,
  children: [
    {
      path: ADMIN_HOME_SUBPATH,
      element: <Navigate to={ADMIN_USERS_SUBPATH} />,
      permissions: [VIEW_ADMIN],
    },
    {
      path: ADMIN_UNAUTHORIZED_SUBPATH,
      element: <Unauthorized />,
    },
  ],
};

const sellerRoutes: RouteConfig = {
  path: SELLER_DASHBOARD_PATH,
  guard: <AuthRoute />,
  element: <Layout page="seller" />,
  children: [
    {
      path: SELLER_DASHBOARD_HOME_SUBPATH,
      element: <Navigate to={SELLER_DASHBOARD_PRODUCTS_SUBPATH} />,
    },
    {
      path: SELLER_DASHBOARD_UNAUTHORIZED_SUBPATH,
      element: <Unauthorized />,
    },
  ],
};

const notfoundRoute: RouteConfig = {
  path: "*",
  element: <NotFound />,
};

const routes = [unauthRoutes, adminRoutes, sellerRoutes, notfoundRoute];

const Routes = () => {
  return (
    <ReactRoutes>
      {routes.map((route) => (
        <Route key={route.path} element={route.guard}>
          <Route element={<PermissionRoute permissions={route.permissions} />}>
            <Route path={route.path} element={route.element}>
              {route.children
                ? route.children.map(({ element, path, permissions }) => (
                    <Route key={path} element={route.guard}>
                      <Route
                        element={<PermissionRoute permissions={permissions} />}
                      >
                        <Route path={path} element={element} />
                      </Route>
                    </Route>
                  ))
                : null}
            </Route>
          </Route>
        </Route>
      ))}
    </ReactRoutes>
  );
};

export default Routes;
