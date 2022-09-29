import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  ADMIN_PATH,
  ADMIN_USERS_SUBPATH,
  SELLER_DASHBOARD_HOME_SUBPATH,
  SELLER_DASHBOARD_PATH,
} from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAdmin, selectIsAuth, selectIsSeller } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const UnauthRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isSeller = useAppSelector(selectIsSeller)
  if (!isAuth) return <Outlet />;
  if (isAdmin) return <Navigate to={ADMIN_PATH + "/" + ADMIN_USERS_SUBPATH} />;
  if (isSeller) return <Navigate to={SELLER_DASHBOARD_PATH  + SELLER_DASHBOARD_HOME_SUBPATH} />;
  
  return isAuth ? (
    <Navigate to={SELLER_DASHBOARD_PATH + SELLER_DASHBOARD_HOME_SUBPATH} />
  ) : (
    <Outlet />
  );
};

export default UnauthRoute;
