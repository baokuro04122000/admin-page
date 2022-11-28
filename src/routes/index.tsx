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
  RESET_PASSWORD_SUBPATH,
  SELLER_DASHBOARD_PATH,
  SELLER_DASHBOARD_HOME_SUBPATH,
  SELLER_DASHBOARD_PRODUCTS_SUBPATH,
  SELLER_DASHBOARD_UNAUTHORIZED_SUBPATH,
  LOGOUT_SUBPATH,
  SIGNUP_SUBPATH,
  USER_PATH,
  SELLER_ADD_PRODUCT_SUBPATH,
  SELLER_EDIT_PRODUCT_SUBPATH,
  SELLER_DASHBOARD_ORDERS_SUBPATH
} from "../constants/routes";

import { RouteConfig } from "../interfaces/routes";
import Layout from "../layout/MainLayout/MainLayout";
import AdminRoute from './AdminRoute';
import SellerRoute from './SellerRoute';
import UserRoute from './UserRoute';
import UnauthRoute from "./UnauthRoute";
import PermissionRoute from "./PermissionRoute";
import UserTest from '../pages/UserPage';
import Logout from "../pages/Logout";
import ResetPassword from "../pages/ResetPassword";
import SignUp from "../pages/SignUp"
import AddProduct from "../pages/AddProduct"
import EditProduct from "../pages/EditProduct"
import Product from "../pages/Products"
import Orders from '../pages/Orders'

const AuthLayout = React.lazy(() => import("../layout/AuthLayout/AuthLayout")) 
const Login = React.lazy(() => import("../pages/Login"));
const NotFound = React.lazy(() => import("../pages/NotFound"));
const Unauthorized = React.lazy(() => import("../pages/Unauthorized"));
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
      path: RESET_PASSWORD_SUBPATH,
      element:<ResetPassword/>
    },
    {
      path: SIGNUP_SUBPATH,
      element:<SignUp/>
    }
  ]
};
const userRoutes: RouteConfig = {
  path: USER_PATH,
  guard: <UserRoute/>,
  element: <UserTest/>
}

const adminRoutes: RouteConfig = {
  path: ADMIN_PATH,
  guard: <AdminRoute />,
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
  guard: <SellerRoute />,
  element: <Layout page="seller" />,
  children: [
    {
      path: SELLER_DASHBOARD_HOME_SUBPATH,
      element: <Navigate to={SELLER_DASHBOARD_PRODUCTS_SUBPATH} />,
    },
    {
      path: SELLER_DASHBOARD_PRODUCTS_SUBPATH,
      element: <Product />,
    },
    {
      path:LOGOUT_SUBPATH,
      element: <Logout />
    },
    {
      path:SELLER_DASHBOARD_UNAUTHORIZED_SUBPATH,
      element: <Unauthorized />
    },
    {
      path:SELLER_ADD_PRODUCT_SUBPATH,
      element: <AddProduct />
    },
    {
      path: SELLER_DASHBOARD_PRODUCTS_SUBPATH + "/"+ SELLER_EDIT_PRODUCT_SUBPATH,
      element: <EditProduct />
    },
    {
      path: SELLER_DASHBOARD_ORDERS_SUBPATH,
      element: <Orders />
    }
  ],
};

const notfoundRoute: RouteConfig = {
  path: "*",
  element: <NotFound />,
};

const routes = [unauthRoutes, adminRoutes, sellerRoutes, userRoutes , notfoundRoute];

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
