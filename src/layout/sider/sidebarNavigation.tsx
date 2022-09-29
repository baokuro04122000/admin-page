import React from 'react';
import {
  CompassOutlined,
  DashboardOutlined,
  FormOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
  UserOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import {
  ADMIN_PATH,
  ADMIN_USERS_SUBPATH
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
    title: 'common.nft-dashboard',
    key: 'nft-dashboard',
    url: ADMIN_PATH,
    icon: <NftIcon />,
  },
  {
    title: 'common.user-management',
    key: 'user-management',
    icon: <HomeOutlined />,
    children: [
      {
        title: 'common.users',
        key: 'users',
        url: ADMIN_PATH+"/"+ ADMIN_USERS_SUBPATH,
      },
      {
        title: 'common.roles',
        key: 'roles',
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
    title: 'common.admin-dashboard',
    key: 'admin-dashboard',
    url: '/',
    icon: <NftIcon />,
  },
  {
    title: 'common.apps',
    key: 'apps',
    icon: <HomeOutlined />,
    children: [
      {
        title: 'common.feed',
        key: 'feed',
        url: '/apps/feed',
      },
      {
        title: 'common.kanban',
        key: 'kanban',
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
