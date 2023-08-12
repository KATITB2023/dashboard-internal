import ArticleCMS from '../pages/article-cms';
import GroupInformation from '~/pages/group-information';
import RekapAbsensi from '~/pages/rekap-absensi';
import RekapPenilaian from '~/pages/rekap-penilaian';
import Feeds from '~/pages/feeds';

import Absensi from '../pages/absensi';
import GroupManagement from '~/pages/group-management';
import Penilaian from '~/pages/penilaian';
import TambahPoin from '~/pages/tambah-poin';

import { type SidebarRoute } from '~/components/sidebar/Links';

import { HiUserGroup } from 'react-icons/hi';
import { FaFileInvoice } from 'react-icons/fa';
import { LuClipboardList } from 'react-icons/lu';
import { RiMailSettingsFill } from 'react-icons/ri';
import { BiSolidCalendarStar } from 'react-icons/bi';
import { BsGrid3X3GapFill } from 'react-icons/bs';

export const adminRoutes: SidebarRoute[] = [
  {
    name: 'Tugas dan Penilaian',
    path: '/rekap-penilaian',
    icon: LuClipboardList,
    component: <RekapPenilaian />
  },
  {
    name: 'Rekap Absensi',
    path: '/rekap-absensi',
    icon: FaFileInvoice,
    component: <RekapAbsensi />
  },
  {
    name: 'Group Information',
    path: '/group-information',
    icon: HiUserGroup,
    component: <GroupInformation />
  },
  {
    name: 'Article CMS',
    path: '/article-cms',
    icon: RiMailSettingsFill,
    component: <ArticleCMS />
  },
  {
    name: 'Feeds',
    path: '/feeds',
    icon: BsGrid3X3GapFill,
    component: <Feeds />
  }
];

export const mentorRoutes: SidebarRoute[] = [
  {
    name: 'Group Management',
    path: '/group-management',
    icon: HiUserGroup,
    component: <GroupManagement />
  },
  {
    name: 'Penilaian',
    path: '/penilaian',
    icon: LuClipboardList,
    component: <Penilaian />
  },
  {
    name: 'Absensi',
    path: '/absensi',
    icon: FaFileInvoice,
    component: <Absensi />
  },
  {
    name: 'Tambah Poin',
    path: '/tambah-poin',
    icon: BiSolidCalendarStar,
    component: <TambahPoin />
  }
];

export const eoRoutes: SidebarRoute[] = [
  {
    name: 'Penilaian',
    path: '/penilaian',
    icon: LuClipboardList,
    component: <Penilaian />
  }
];
