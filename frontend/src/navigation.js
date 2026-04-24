export const navItems = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    id: 'facilities',
    path: '/facilities',
    label: 'Facilities',
    icon: 'facilities',
  },
  {
    id: 'bookings',
    path: '/bookings',
    label: 'Bookings',
    icon: 'bookings',
  },
  {
    id: 'incidents',
    path: '/incidents',
    label: 'Incident Tickets',
    icon: 'incidents',
  },
  {
    id: 'users',
    path: '/users',
    label: 'Users',
    icon: 'users',
  },
];

export const pageConfig = {
  '/dashboard':  { title: 'Dashboard',        breadcrumb: ['Dashboard'] },
  '/facilities': { title: 'Facilities',        breadcrumb: ['Facilities'] },
  '/bookings':   { title: 'Bookings',          breadcrumb: ['Bookings'] },
  '/incidents':  { title: 'Incident Tickets',  breadcrumb: ['Incident Tickets'] },
  '/users':      { title: 'Users',             breadcrumb: ['Users'] },
};
