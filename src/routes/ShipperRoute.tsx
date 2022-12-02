import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN_PATH, LOGIN_PATH, SELLER_DASHBOARD_PATH, USER_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth, selectIsUser, selectIsSeller, selectIsAdmin, selectIsShipper } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const ShipperRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isUser = useAppSelector(selectIsUser);
  const isSeller = useAppSelector(selectIsSeller);
  const isShipper = useAppSelector(selectIsShipper)

  if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  if (isUser) return < Navigate to={USER_PATH} />;
  if(isShipper) return <Outlet />
  if (isSeller) return < Navigate to={SELLER_DASHBOARD_PATH} />;
  if (isAdmin) return < Navigate to={ADMIN_PATH} />;
  return <Outlet/>
};

export default ShipperRoute;
