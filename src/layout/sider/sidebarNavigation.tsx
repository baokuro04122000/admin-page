import React from 'react';
import {
  HomeOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import {
  SELLER_DASHBOARD_HOME_SUBPATH,
  SELLER_DASHBOARD_PATH,
  SELLER_DASHBOARD_PRODUCTS_SUBPATH,
  SELLER_ADD_PRODUCT_SUBPATH
} from '../../constants/routes'
import { ReactComponent as NftIcon } from '../../assets/icons/nft-icon.svg';


export interface SidebarNavigationItem {
  title: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
}

export const sidebarNavigationSeller: SidebarNavigationItem[] = [
  {
    title: 'common.sellerDashboard',
    key: 'sellerDashboard',
    url: SELLER_DASHBOARD_PATH + SELLER_DASHBOARD_HOME_SUBPATH,
    icon: <NftIcon />,
  },
  {
    title: 'common.shop',
    key: 'shop',
    icon: <HomeOutlined />,
    children: [
      {
        title: 'common.products',
        key: 'products',
        url: SELLER_DASHBOARD_PATH+ SELLER_DASHBOARD_PRODUCTS_SUBPATH,
      },
      {
        title: 'common.addProduct',
        key: 'addProduct',
        url: SELLER_DASHBOARD_PATH+ SELLER_ADD_PRODUCT_SUBPATH,
      },
      {
        title: 'common.orders',
        key: 'orders',
        url: '/apps/kanban',
      },
    ],
  },
  {
    title: 'common.charts',
    key: 'charts',
    url: '/charts',
    icon: <LineChartOutlined />,
  }
];

export const sidebarNavigationAdmin: SidebarNavigationItem[] = [
  {
    title: 'common.adminDashboard',
    key: 'adminDashboard',
    url: '/',
    icon: <NftIcon />,
  },
  {
    title: 'common.userManagement',
    key: 'userManagement',
    icon: <HomeOutlined />,
    children: [
      {
        title: 'common.users',
        key: 'users',
        url: '/admin/users',
      },
      {
        title: 'common.roles',
        key: 'roles',
        url: '/admin/roles',
      },
    ],
  },
  {
    title: 'common.charts',
    key: 'charts',
    url: '/charts',
    icon: <LineChartOutlined />,
  }
];
