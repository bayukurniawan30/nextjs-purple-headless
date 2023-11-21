import {
  IconAlignBoxLeftMiddle,
  IconFileDescription,
  IconPhoto,
  IconSettings2,
  IconStack2,
  IconLayoutDashboard,
  IconUsers,
  IconApi,
  IconListCheck,
} from '@tabler/icons-react'

import { uniqueId } from 'lodash'

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/',
  },
  // {
  //   navlabel: true,
  //   subheader: "Content",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Collections",
  //   icon: IconStack2,
  //   href: "/utilities/typography",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Singletons",
  //   icon: IconAlignBoxLeftMiddle,
  //   href: "/utilities/shadow",
  // },
  {
    navlabel: true,
    subheader: 'Media',
  },
  {
    id: uniqueId(),
    title: 'Images',
    icon: IconPhoto,
    href: '/media/images',
  },
  {
    id: uniqueId(),
    title: 'Documents',
    icon: IconFileDescription,
    href: '/media/documents',
  },
  {
    navlabel: true,
    subheader: 'Settings',
  },
  {
    id: uniqueId(),
    title: 'General Settings',
    icon: IconSettings2,
    href: '/settings/general',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUsers,
    href: '/settings/users',
  },
  // {
  //   id: uniqueId(),
  //   title: "Role & Permission",
  //   icon: IconListCheck,
  //   href: "/settings/role-permission",
  // },
  // {
  //   id: uniqueId(),
  //   title: "API",
  //   icon: IconApi,
  //   href: "/settings/api",
  // },
]

export default Menuitems
