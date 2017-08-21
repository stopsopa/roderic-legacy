
import React from 'react';

const Todo = ({
    onToggle,
    completed,
    text
}) => (
    <li
        onClick={() => onToggle()}
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