import { FC, ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN_PATH, LOGIN_PATH, USER_PATH } from "../constants/routes";
import { useAppSelector } from "../store";
import { selectIsAuth, selectIsUser, selectIsSeller, selectIsAdmin } from "../store/authentication/selector";

interface Props {
  children?: ReactElement;
}

const SellerRoute: FC<Props> = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const isAdmin = useAppSelector(selectIsAdmin);
  const isUser = useAppSelector(selectIsUser);
  const isSeller = useAppSelector(selectIsSeller);
  console.log("Check::",isAuth)
  if (!isAuth) return <Navigate to={LOGIN_PATH} />;
  if(isSeller) return <Outlet />
  if (isAdmin) return < Navigate to={ADMIN_PATH} />;
  if (isUser) return < Navigate to={USER_PATH} />;
  return <Outlet/>
};

export default SellerRoute;
