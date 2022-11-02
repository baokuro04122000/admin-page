import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN_PATH, LOGIN_PATH, SELLER_DASHBOARD_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth, selectIsUser, selectIsSeller, selectIsAdmin } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const UserRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isUser = useAppSelector(selectIsUser);
  const isSeller = useAppSelector(selectIsSeller);
  if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  if(isUser) return <Outlet />
  if (isSeller) return < Navigate to={SELLER_DASHBOARD_PATH} />;
  if (isAdmin) return < Navigate to={ADMIN_PATH} />;
  return <Outlet/>
};

export default UserRoute;
