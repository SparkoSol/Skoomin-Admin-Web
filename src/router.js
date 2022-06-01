import Vue from 'vue'
import VueRouter from 'vue-router'

import SignInView from './views/auth/SignIn';
import NotFound from './views/404.vue';


import Dashboard from './components/Dashboard';
import Order from './views/orders/OrdersView.vue';
import schoolReg from './views/schoolReg.vue';
import schoolEdit from './views/schoolEdit.vue';
import schoolView from './views/schoolView.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Dashboard,
        children: [
            {
                path: '/',
                component: Order
            },
            {
                path: '/school',
                component: schoolReg
            },
            {
                path: '/schoolEdit',
                component: schoolEdit
            },
            {
                path: '/schoolView',
                component: schoolView
            },
        ]
    },
    
    
    {
        name: 'SignIn',
        path: '/auth/sign-in',
        component: SignInView
    },
    {
        name: 'NotFound',
        path: '**',
        component: NotFound
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
// eslint-disable-next-line no-unused-vars
router.beforeEach((to, __, next) => {
    if (!localStorage.getItem('user')) {
        if (to.path !== '/auth/sign-in') {
            next('/auth/sign-in');
        }
    } else if (to.path === '/auth/sign-in') {
        next('/')
    }

    next();
});


export default router
