export const navItems = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: ['ADMIN', 'USER'],
  },
  {
    id: 'facilities',
    path: '/facilities',
    label: 'Facilities',
    icon: 'facilities',
    roles: ['ADMIN', 'USER'],
  },
  {
    id: 'bookings',
    path: '/bookings',
    label: 'Bookings',
    icon: 'bookings',
    roles: ['ADMIN', 'USER'],
  },
  {
    id: 'incidents',
    path: '/incidents',
    label: 'Incident Tickets',
    icon: 'incidents',
    roles: ['ADMIN', 'USER'],
  },
  {
    id: 'users',
    path: '/users',
    label: 'Users',
    icon: 'users',
    roles: ['ADMIN'],
  },
];

export const pageConfig = {
  '/dashboard':  { title: 'Dashboard',        breadcrumb: ['Dashboard'] },
  '/facilities': { title: 'Facilities',        breadcrumb: ['Facilities'] },
  '/bookings':   { title: 'Bookings',          breadcrumb: ['Bookings'] },
  '/incidents':  { title: 'Incident Tickets',  breadcrumb: ['Incident Tickets'] },
  '/users':      { title: 'Users',             breadcrumb: ['Users'] },
};
