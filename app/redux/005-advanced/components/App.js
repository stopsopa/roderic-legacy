
import React from 'react';

import TodoForm from './TodoForm';
import VisibleTodoList from './VisibleTodoList';
import Footer from './Footer';

const App = ({ match }) => (
    <div>
        <TodoForm />
        <VisibleTodoList />
        <Footer />
    </div>
);

export default App;