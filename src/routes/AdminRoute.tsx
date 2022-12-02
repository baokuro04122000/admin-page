import React, { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LOGIN_PATH, SELLER_DASHBOARD_PATH, SHIPPER_DASHBOARD_ORDERS_SUBPATH, SHIPPER_DASHBOARD_PATH, USER_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth, selectIsUser, selectIsSeller, selectIsAdmin, selectIsShipper } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const AdminRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isUser = useAppSelector(selectIsUser);
  const isSeller = useAppSelector(selectIsSeller);
  const isShipper = useAppSelector(selectIsShipper)
  if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  if(isAdmin) return <Outlet />
  if (isUser) return < Navigate to={USER_PATH} />;
  if (isSeller) return < Navigate to={SELLER_DASHBOARD_PATH} />;
  if(isShipper) return < Navigate to={SHIPPER_DASHBOARD_PATH+"/"+SHIPPER_DASHBOARD_ORDERS_SUBPATH} />
  return <Outlet/>
};

export default AdminRoute;
