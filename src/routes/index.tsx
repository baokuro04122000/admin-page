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
  SELLER_DASHBOARD_ORDERS_SUBPATH,
  SHIPPER_DASHBOARD_PATH,
  SHIPPER_DASHBOARD_ORDERS_SUBPATH,
  CHANGE_PASSWORD_SUBPATH
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
import ConfirmEmail from "../pages/ForgotPassword/ConfirmEmail";
import ResetPassword from "../pages/ForgotPassword/ResetPassword";
import SignUp from "../pages/SignUp"
import SignUpUser from "../pages/UserSignUp"
import AddProduct from "../pages/AddProduct"
import EditProduct from "../pages/EditProduct"
import Product from "../pages/Products"
import Orders from '../pages/Orders'
import ShipperRoute from './ShipperRoute';
import OrdersShipper from '../pages/OrdersShipper'

import AuthLayout from "../layout/AuthLayout/AuthLayout" 
import Login from "../pages/Login";
import ManageCategory from '../pages/Admin/ManageCategory';
import ManageUser from 'pages/Admin/ManageUsers';
import Dashboard from 'pages/Dashboard';
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
      element:<ConfirmEmail />
    },
    {
      path: CHANGE_PASSWORD_SUBPATH,
      element:<ResetPassword />
    },
    {
      path: SIGNUP_SUBPATH,
      element:<SignUp/>
    },
    {
      path: 'sign-up',
      element:<SignUpUser/>
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
      path: 'categories',
      element: <ManageCategory />,
    },
    {
      path: 'users',
      element: <ManageUser />
    },
    {
      path: ADMIN_UNAUTHORIZED_SUBPATH,
      element: <Unauthorized />,
    },
    {
      path:LOGOUT_SUBPATH,
      element: <Logout />
    }
  ],
};

const sellerRoutes: RouteConfig = {
  path: SELLER_DASHBOARD_PATH,
  guard: <SellerRoute />,
  element: <Layout page="seller" />,
  children: [
    {
      path: SELLER_DASHBOARD_HOME_SUBPATH,
      element: <Dashboard />,
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

const shipperRoutes : RouteConfig = {
  path: SHIPPER_DASHBOARD_PATH,
  guard: <ShipperRoute />,
  element: <Layout page="shipper" />,
  children: [
    {
      path: SHIPPER_DASHBOARD_ORDERS_SUBPATH,
      element: <OrdersShipper />,
    },
    {
      path:LOGOUT_SUBPATH,
      element: <Logout />
    }
  ],
}

const notfoundRoute: RouteConfig = {
  path: "*",
  element: <NotFound />,
};

const routes = [unauthRoutes, adminRoutes, sellerRoutes, userRoutes ,shipperRoutes, notfoundRoute];

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
