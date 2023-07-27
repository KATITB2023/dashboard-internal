import ArticleCMS from '../pages/admin/article-cms';
import GroupInformation from '../pages/admin/group-information';
import RekapAbsensi from '../pages/admin/rekap-absensi';
import RekapPenilaian from '../pages/admin/rekap-penilaian';

import Absensi from '../pages/mentor/absensi';
import GroupManagement from '../pages/mentor/group-management';
import Penilaian from '../pages/mentor/penilaian';

import { SidebarRoute } from '~/component/sidebar/Links';

export const adminRoutes: SidebarRoute[] = [
  {
    name: 'Rekap Penilaian',
    layout: '/admin',
    path: '/rekap-penilaian',
    iconPath: '/img/sidebar/penilaian-icon-',
    component: RekapPenilaian
  },
  {
    name: 'Rekap Absensi',
    layout: '/admin',
    path: '/rekap-absensi',
    iconPath: '/img/sidebar/absensi-icon-',
    component: RekapAbsensi
  },
  {
    name: 'Group Information',
    layout: '/admin',
    iconPath: '/img/sidebar/group-icon-',
    path: '/group-information',
    component: GroupInformation
  },
  {
    name: 'Article CMS',
    layout: '/admin',
    path: '/article-cms',
    iconPath: '/img/sidebar/article-cms-icon-',
    component: ArticleCMS
  }
];

export const mentorRoutes: SidebarRoute[] = [
  {
    name: 'Group Management',
    layout: '/mentor',
    path: '/group-management',
    iconPath: '/img/sidebar/group-icon-',
    component: GroupManagement
  },
  {
    name: 'Penilaian',
    layout: '/mentor',
    path: '/penilaian',
    iconPath: '/img/sidebar/penilaian-icon-',
    component: Penilaian
  },
  {
    name: 'Absensi',
    layout: '/mentor',
    path: '/absensi',
    iconPath: '/img/sidebar/absensi-icon-',
    component: Absensi
  }
];
