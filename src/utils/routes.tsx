import ArticleCMS from '../pages/article-cms';
import GroupInformation from '~/pages/group-information';
import RekapAbsensi from '~/pages/rekap-absensi';
import RekapPenilaian from '~/pages/rekap-penilaian';

import Absensi from '../pages/absensi';
import GroupManagement from '~/pages/group-management';
import Penilaian from '~/pages/penilaian';

import { SidebarRoute } from '~/component/sidebar/Links';

export const adminRoutes: SidebarRoute[] = [
  {
    name: 'Rekap Penilaian',
    path: '/rekap-penilaian',
    iconPath: '/img/sidebar/penilaian-icon-',
    component: RekapPenilaian
  },
  {
    name: 'Rekap Absensi',
    path: '/rekap-absensi',
    iconPath: '/img/sidebar/absensi-icon-',
    component: RekapAbsensi
  },
  {
    name: 'Group Information',
    iconPath: '/img/sidebar/group-icon-',
    path: '/group-information',
    component: GroupInformation
  },
  {
    name: 'Article CMS',
    path: '/article-cms',
    iconPath: '/img/sidebar/article-cms-icon-',
    component: ArticleCMS
  }
];

export const mentorRoutes: SidebarRoute[] = [
  {
    name: 'Group Management',
    path: '/group-management',
    iconPath: '/img/sidebar/group-icon-',
    component: GroupManagement
  },
  {
    name: 'Penilaian',
    path: '/penilaian',
    iconPath: '/img/sidebar/penilaian-icon-',
    component: Penilaian
  },
  {
    name: 'Absensi',
    path: '/absensi',
    iconPath: '/img/sidebar/absensi-icon-',
    component: Absensi
  }
];
