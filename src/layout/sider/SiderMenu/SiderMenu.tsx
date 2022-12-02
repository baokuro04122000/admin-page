import React, {useMemo} from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import * as S from './SiderMenu.styles';
import { 
  sidebarNavigationSeller, 
  sidebarNavigationAdmin ,
  SidebarNavigationItem,
  sidebarNavigationShipper
} from '../sidebarNavigation';
import { Menu } from 'antd';

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
  page: string
}

const sidebarNavFlat = sidebarNavigationSeller.reduce(
  (result: SidebarNavigationItem[], current) =>
    result.concat(current.children && current.children.length > 0 ? current.children : current),
  [],
);
const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed, page }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const currentMenuItem = sidebarNavFlat.find(({ url }) => url === location.pathname);
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  
  const navigation = useMemo(() => {
    if(page === "admin"){
      const openedSubmenu = sidebarNavigationAdmin.find(({ children }) =>
        children?.some(({ url }) => url === location.pathname),
      );
      const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

      return {
        defaultOpenKeys,
        sidebarNavigation: sidebarNavigationAdmin
      }
    }
    if(page === "seller"){
      const openedSubmenu = sidebarNavigationSeller.find(({ children }) =>
      children?.some(({ url }) => url === location.pathname),
      );
      const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

      return {
        defaultOpenKeys,
        sidebarNavigation: sidebarNavigationSeller
      }
    }
    if(page === "shipper"){
      const openedSubmenu = sidebarNavigationSeller.find(({ children }) =>
      children?.some(({ url }) => url === location.pathname),
      );
      const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

      return {
        defaultOpenKeys,
        sidebarNavigation: sidebarNavigationShipper
      }
    }
    return null
  }, [page])


  return ( 
    <>
      <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={navigation?.defaultOpenKeys}
      onClick={() => setCollapsed(true)}
    >
      {navigation?.sidebarNavigation.map((nav) =>
        nav.children && nav.children.length > 0 ? (
          <Menu.SubMenu
            key={nav.key}
            title={t(nav.title)}
            icon={nav.icon}
            onTitleClick={() => setCollapsed(false)}
            popupClassName="d-none"
          >
            {nav.children.map((childNav) => (
              <Menu.Item key={childNav.key} title="">
                <Link to={childNav.url || ''}>{t(childNav.title)}</Link>
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={nav.key} title="" icon={nav.icon}>
            <Link to={nav.url || ''}>{t(nav.title)}</Link>
          </Menu.Item>
        ),
      )}
    </S.Menu>
    </>
  );
};

export default SiderMenu;
