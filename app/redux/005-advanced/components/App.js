
import React from 'react';
import { connect } from 'react-redux';

import TodoForm from './TodoForm';

import FilterLink from './FilterLink';

import VisibleTodoList from './VisibleTodoList';

import Footer from './Footer';


const App = () => (
    <div>
        <TodoForm />
        <VisibleTodoList />
        <Footer />
    </div>
);

export default App;