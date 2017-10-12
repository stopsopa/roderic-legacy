
import React from 'react';

const Todo = ({
    toggleTodo,
    completed,
    text
}) => (
    <li
        onClick={() => toggleTodo()}
        style={{
            textDecoration:
                completed ?
                    'line-through' :
                    'none'
        }}
    >
        {text}
    </li>
);

export default Todo;