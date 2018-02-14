
import AdminHome from './pages/AdminHome';

// import Programs from './pages/Programs';
//
// import Contact from './pages/Contact';

const prefix = '/admin';

const routes = [
    {
        path: prefix + "/",
        component: AdminHome,
        exact: true
    },
    // {
    //     path: "/programs",
    //     component: Programs,
    //     exact: true
    // },
    // {
    //     path: "/contact",
    //     component: Contact,
    //     exact: true
    // }
];

export default routes;