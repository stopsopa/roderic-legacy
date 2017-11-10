
import Home from './components/Home';

import List from './components/List';

import Edit from './components/Edit';

import MainListVisible from './components/MainListVisible';

const routes = [
    {
        path: "/gui",
        component: MainListVisible,
        exact: true
    },
    {
        path: "/gui/list",
        component: List,
        exact: true
    },
    {
        path: "/gui/edit/:id",
        component: Edit,
        exact: true
    },
    {
        path: "/gui/create",
        component: Edit,
        exact: true
    }
];

export default routes;