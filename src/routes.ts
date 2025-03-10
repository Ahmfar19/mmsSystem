/* eslint-disable import/prefer-default-export */
import { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

const filters = {
    parent: ['edit'], // allow enum values
    id: /^\d+$/, // only allow numbers
};

export const routes: RouteDefinition[] = [
    {
        path: '/login',
        component: lazy(() => import('./pages/LogIn')),
    },
    {
        path: ['/home', '/'],
        component: lazy(() => import('./pages/Home')),
        // data: () => ({
        //   benchmarks: BenchmarkData(),
        // }),
    },
    {
        path: '/blank',
        component: lazy(() => import('./pages/Blank')),
    },
    {
        path: '/newMark',
        component: lazy(() => import('./pages/NewMark')),
    },
    {
        path: '/searchMark',
        component: lazy(() => import('./pages/SearchMark')),
    },
    {
        path: '/invoiveMark/:id?',
        component: lazy(() => import('./pages/InvoiceMark')),
    },
    {
        path: ['/managemark', '/managemark/edit/:id'],
        component: lazy(() => import('./pages/MarkManage')),
    },
    {
        path: ['/newcustomer', '/newcustomer/edit/:id'],
        component: lazy(() => import('./pages/NewCustomer')),
        matchFilters: filters,
    },
    {
        path: ['/newagent', '/newagent/edit/:id'],
        component: lazy(() => import('./pages/NewAgent')),
        matchFilters: filters,
    },
    {
        path: '/allagents',
        component: lazy(() => import('./pages/AllAgents')),
    },
    {
        path: '/allcustomers',
        component: lazy(() => import('./pages/AllCustomers')),
    },
    {
        path: ['/settings', '/settings/edit/:id'],
        component: lazy(() => import('./pages/Settings')),
        matchFilters: filters,
    },
    {
        path: '/*',
        component: lazy(() => import('./pages/404')),
    },
];

// This route is used to avoid routing to /* before logging in.
export const routes2: RouteDefinition[] = [
    {
        path: '/*',
        component: lazy(() => import('./pages/LogIn')),
    },
];
