import ArticleCMS from '../pages/article-cms';
import GroupInformation from '~/pages/group-information';
import RekapAbsensi from '~/pages/rekap-absensi';
import RekapPenilaian from '~/pages/rekap-penilaian';

import Absensi from '../pages/absensi';
import GroupManagement from '~/pages/group-management';
import Penilaian from '~/pages/penilaian';
import TambahPoin from '~/pages/tambah-poin';

import { SidebarRoute } from '~/component/sidebar/Links';

const PenilaianIcon = (
  <svg
    width='25'
    height='33'
    viewBox='0 0 25 33'
    fill='none'
    stroke='currentColor'
    xmlns='http://www.w3.org/2000/svg'
  >
    <rect
      x='2'
      y='5.7'
      width='21'
      height='25.6'
      rx='2'
      stroke='currentColor'
      stroke-width='2.5'
    />
    <path
      d='M6.5 15L11.5 15'
      stroke='currentColor'
      stroke-width='2.5'
      stroke-linecap='round'
    />
    <path
      d='M16 16.2747L18.4749 13.7999'
      stroke='currentColor'
      stroke-width='2.5'
      stroke-linecap='round'
    />
    <path
      d='M16 13.7999L18.4749 16.2748'
      stroke='currentColor'
      stroke-width='2.5'
      stroke-linecap='round'
    />
    <path
      d='M6.5 23.2001H11.5'
      stroke='currentColor'
      stroke-width='2.5'
      stroke-linecap='round'
    />
    <path
      d='M16 24.4749L18.4749 22'
      stroke='currentColor'
      stroke-width='2.5'
      stroke-linecap='round'
    />
    <path
      d='M16 22L18.4749 24.4749'
      stroke='currentColor'
      stroke-width='2.5'
      stroke-linecap='round'
    />
    <path
      d='M8.69995 7L16.3 7'
      stroke='currentColor'
      stroke-width='4.2'
      stroke-linecap='round'
    />
    <circle
      cx='12.5'
      cy='4.7'
      r='2.5'
      stroke='currentColor'
      stroke-width='2.5'
    />
  </svg>
);

const AbsensiIcon = (
  <svg
    width='25'
    height='31'
    viewBox='0 0 25 31'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M2.75 0.25H15.95L24.25 8.55V28.75C24.25 29.8546 23.3546 30.75 22.25 30.75H2.75C1.64539 30.75 0.75 29.8546 0.75 28.75V2.25C0.75 1.14543 1.64539 0.25 2.75 0.25ZM15 9V2.36397L22.636 10H16C15.4478 10 15 9.55229 15 9ZM18.6516 18.9194L17.7678 18.0356L16.8839 18.9194C16.3958 19.4076 15.6042 19.4076 15.1161 18.9194C14.6279 18.4313 14.6279 17.6398 15.1161 17.1517L16 16.2678L15.1161 15.3839C14.6279 14.8957 14.6279 14.1043 15.1161 13.6161C15.6042 13.128 16.3958 13.128 16.8839 13.6161L17.7678 14.5L18.6516 13.6161C19.1398 13.128 19.9313 13.128 20.4194 13.6161C20.9076 14.1043 20.9076 14.8957 20.4194 15.3839L19.5355 16.2678L20.4194 17.1517C20.9076 17.6398 20.9076 18.4313 20.4194 18.9194C19.9313 19.4076 19.1398 19.4076 18.6516 18.9194ZM17.1 24.3322L16.8839 24.1161C16.3958 23.628 15.6042 23.628 15.1161 24.1161C14.6279 24.6043 14.6279 25.3957 15.1161 25.8839L16.1768 26.9445C16.5697 27.3375 17.1594 27.4142 17.629 27.1744C17.795 27.1139 17.9507 27.017 18.0839 26.8839L21.478 23.4898C21.9661 23.0016 21.9661 22.2102 21.478 21.722C20.9897 21.2338 20.1984 21.2339 19.7102 21.722L17.1 24.3322ZM3.15002 15.5C3.15002 14.8096 3.70972 14.25 4.40002 14.25H5.5C6.19043 14.25 6.75 14.8096 6.75 15.5C6.75 16.1904 6.19043 16.75 5.5 16.75H4.40002C3.70972 16.75 3.15002 16.1904 3.15002 15.5ZM10.2 14.25C9.50964 14.25 8.94995 14.8096 8.94995 15.5C8.94995 16.1904 9.50964 16.75 10.2 16.75H11.2999C11.9904 16.75 12.5499 16.1904 12.5499 15.5C12.5499 14.8096 11.9904 14.25 11.2999 14.25H10.2ZM3.15002 23.6C3.15002 22.9097 3.70972 22.35 4.40002 22.35H5.5C6.19043 22.35 6.75 22.9097 6.75 23.6C6.75 24.2904 6.19043 24.85 5.5 24.85H4.40002C3.70972 24.85 3.15002 24.2904 3.15002 23.6ZM10.2 22.35C9.50964 22.35 8.94995 22.9097 8.94995 23.6C8.94995 24.2904 9.50964 24.85 10.2 24.85H11.2999C11.9904 24.85 12.5499 24.2904 12.5499 23.6C12.5499 22.9097 11.9904 22.35 11.2999 22.35H10.2Z'
      fill='currentColor'
    />
  </svg>
);

const GroupIcon = (
  <svg
    width='29'
    height='24'
    viewBox='0 0 29 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <circle cx='14.5' cy='5.39999' r='5' fill='currentColor' />
    <circle cx='5.09998' cy='8.5' r='3.5' fill='currentColor' />
    <circle cx='23.9' cy='8.5' r='3.5' fill='currentColor' />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M21.4714 23.9C21.4903 23.5706 21.5 23.2371 21.5 22.9C21.5 16.8249 18.366 11.9 14.5 11.9C10.634 11.9 7.5 16.8249 7.5 22.9C7.5 23.2371 7.5097 23.5706 7.52856 23.9H21.4714Z'
      fill='currentColor'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M7.81582 15.1608C7.03381 14.205 6.10127 13.65 5.09998 13.65C2.33855 13.65 0.0999756 17.8713 0.0999756 23.0786C0.0999756 23.3675 0.106868 23.6534 0.120359 23.9357H5.92449C5.90824 23.6215 5.89996 23.3039 5.89996 22.9833C5.89996 19.9877 6.62289 17.2509 7.81582 15.1608Z'
      fill='currentColor'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M21.2842 15.1608C22.0662 14.205 22.9987 13.65 24 13.65C26.7614 13.65 29 17.8713 29 23.0786C29 23.3675 28.9931 23.6534 28.9796 23.9357H23.1755C23.1917 23.6215 23.2 23.3039 23.2 22.9833C23.2 19.9877 22.4771 17.2509 21.2842 15.1608Z'
      fill='currentColor'
    />
  </svg>
);

const ArticleCMSIcon = (
  <svg
    width='33'
    height='32'
    viewBox='0 0 33 32'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M0.5 2.70001C0.5 1.59543 1.39539 0.700012 2.5 0.700012H26.5C27.6046 0.700012 28.5 1.59543 28.5 2.70001V13.3081C27.7472 12.9306 26.9427 12.641 26.1 12.4527V6.39999H2.90002V24H13.3798C13.4828 24.8343 13.6837 25.6382 13.9706 26.4H2.5C1.39539 26.4 0.5 25.5046 0.5 24.4V2.70001Z'
      fill='currentColor'
    />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M15.5 10C14.9478 10 14.5 10.4477 14.5 11V17.8211C16.2568 14.4791 19.7623 12.2 23.8 12.2C23.8167 12.2 23.8334 12.2 23.85 12.2001V11C23.85 10.4477 23.4023 10 22.85 10H15.5Z'
      fill='currentColor'
    />
    <rect
      x='5.19995'
      y='10'
      width='7'
      height='2.3'
      rx='1'
      fill='currentColor'
    />
    <rect
      x='5.19995'
      y='14.7'
      width='7'
      height='2.3'
      rx='1'
      fill='currentColor'
    />
    <rect
      x='5.19995'
      y='19.35'
      width='7'
      height='2.3'
      rx='1'
      fill='currentColor'
    />
    <circle cx='23.85' cy='22.8' r='1.25' fill='currentColor' />
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M24.6238 14.9451C24.2237 14.4564 23.4763 14.4564 23.0763 14.9451L22.5185 15.6264C22.2465 15.9585 21.793 16.0801 21.3914 15.9284L20.5677 15.6172C19.9768 15.3941 19.3296 15.7678 19.2274 16.391L19.0851 17.2599C19.0157 17.6836 18.6836 18.0156 18.2599 18.085L17.391 18.2274C16.7677 18.3296 16.3941 18.9768 16.6173 19.5676L16.9284 20.3913C17.0801 20.7929 16.9585 21.2465 16.6264 21.5184L15.9451 22.0762C15.4565 22.4763 15.4565 23.2237 15.9451 23.6237L16.6264 24.1815C16.9585 24.4535 17.0801 24.9071 16.9284 25.3086L16.6173 26.1324C16.3941 26.7232 16.7677 27.3704 17.391 27.4726L18.2599 27.615C18.6836 27.6844 19.0157 28.0164 19.0851 28.4401L19.2274 29.309C19.3296 29.9322 19.9768 30.3059 20.5677 30.0827L21.3914 29.7716C21.793 29.6199 22.2465 29.7415 22.5185 30.0736L23.0763 30.7549C23.4763 31.2436 24.2237 31.2436 24.6238 30.7549L25.1815 30.0736C25.4535 29.7415 25.9071 29.6199 26.3086 29.7716L27.1324 30.0827C27.7233 30.3059 28.3704 29.9322 28.4726 29.309L28.615 28.4401C28.6845 28.0164 29.0165 27.6844 29.4401 27.615L30.309 27.4726C30.9323 27.3704 31.3059 26.7232 31.0828 26.1324L30.7716 25.3086C30.62 24.9071 30.7415 24.4535 31.0736 24.1815L31.7549 23.6237C32.2437 23.2237 32.2437 22.4763 31.7549 22.0763L31.0736 21.5184C30.7415 21.2465 30.62 20.7929 30.7716 20.3913L31.0828 19.5676C31.3059 18.9768 30.9323 18.3296 30.309 18.2274L29.4401 18.085C29.0165 18.0156 28.6845 17.6836 28.615 17.2599L28.4726 16.391C28.3704 15.7678 27.7233 15.3941 27.1324 15.6172L26.3086 15.9284C25.9071 16.0801 25.4535 15.9585 25.1815 15.6264L24.6238 14.9451ZM23.85 27.7C26.5286 27.7 28.7 25.5286 28.7 22.85C28.7 20.1714 26.5286 18 23.85 18C21.1714 18 19 20.1714 19 22.85C19 25.5286 21.1714 27.7 23.85 27.7Z'
      fill='currentColor'
    />
  </svg>
);

const TambahPoinIcon = (
  <svg
    width='27'
    height='27'
    viewBox='0 0 27 27'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      fill-rule='evenodd'
      clip-rule='evenodd'
      d='M3.09998 0.600006C1.71924 0.600006 0.599976 1.7193 0.599976 3.10001V24.1C0.599976 25.4807 1.71924 26.6 3.09998 26.6H24.1C25.4807 26.6 26.6 25.4807 26.6 24.1V3.10001C26.6 1.7193 25.4807 0.600006 24.1 0.600006H3.09998ZM13.9756 3.96353C13.8258 3.50287 13.1742 3.50287 13.0244 3.96353L11.1426 9.75531C11.0757 9.96133 10.8837 10.1008 10.6671 10.1008H4.57727C4.0929 10.1008 3.89148 10.7206 4.28333 11.0053L9.21008 14.5848C9.38538 14.7122 9.45874 14.9379 9.39172 15.1439L7.50989 20.9357C7.36023 21.3963 7.88745 21.7794 8.2793 21.4947L13.2061 17.9152C13.3813 17.7878 13.6187 17.7878 13.7939 17.9152L18.7207 21.4947C19.1125 21.7794 19.6398 21.3963 19.4901 20.9357L17.6083 15.1439C17.5413 14.9379 17.6146 14.7122 17.7899 14.5848L22.7167 11.0053C23.1085 10.7206 22.9071 10.1008 22.4227 10.1008H16.3329C16.1163 10.1008 15.9243 9.96133 15.8574 9.75531L13.9756 3.96353Z'
      fill='currentColor'
    />
  </svg>
);

export const adminRoutes: SidebarRoute[] = [
  {
    name: 'Rekap Penilaian',
    path: '/rekap-penilaian',
    icon: PenilaianIcon,
    component: <RekapPenilaian />
  },
  {
    name: 'Rekap Absensi',
    path: '/rekap-absensi',
    icon: AbsensiIcon,
    component: <RekapAbsensi />
  },
  {
    name: 'Group Information',
    path: '/group-information',
    icon: GroupIcon,
    component: <GroupInformation />
  },
  {
    name: 'Article CMS',
    path: '/article-cms',
    icon: ArticleCMSIcon,
    component: <ArticleCMS />
  }
];

export const mentorRoutes: SidebarRoute[] = [
  {
    name: 'Group Management',
    path: '/group-management',
    icon: GroupIcon,
    component: <GroupManagement />
  },
  {
    name: 'Penilaian',
    path: '/penilaian',
    icon: PenilaianIcon,
    component: <Penilaian />
  },
  {
    name: 'Absensi',
    path: '/absensi',
    icon: AbsensiIcon,
    component: <Absensi />
  },
  {
    name: 'Tambah Poin',
    path: '/tambah-poin',
    icon: TambahPoinIcon,
    component: <TambahPoin />
  }
];
