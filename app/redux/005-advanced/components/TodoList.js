
import React from 'react';
import Todo from './Todo';

const TodoList = ({
    todos,
    onToggle
}) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onToggle={() => onToggle(todo.id)}
            />
        )}
    </ul>
);

export default TodoList;