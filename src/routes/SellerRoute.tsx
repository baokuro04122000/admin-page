import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN_PATH, LOGIN_PATH, SHIPPER_DASHBOARD_ORDERS_SUBPATH, SHIPPER_DASHBOARD_PATH, USER_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth, selectIsUser, selectIsSeller, selectIsAdmin, selectIsShipper } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const SellerRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isUser = useAppSelector(selectIsUser);
  const isSeller = useAppSelector(selectIsSeller);
  const isShipper = useAppSelector(selectIsShipper)
  
  // if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  // if(isSeller) return <Outlet />
  // if (isAdmin) return < Navigate to={ADMIN_PATH} />;
  // if (isUser) return < Navigate to={USER_PATH} />;
  // if(isShipper) return < Navigate to={SHIPPER_DASHBOARD_PATH+"/"+SHIPPER_DASHBOARD_ORDERS_SUBPATH} />
  return <Outlet/>
};

export default SellerRoute;
