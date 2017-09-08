
'use strict';

import uuid4 from 'uuid/v4';

const fakeDatabase = {
    todos: [
        {
            id: uuid4(),
            text: 'hey',
            completed: true
        },
        {
            id: uuid4(),
            text: 'ho',
            completed: true
        },
        {
            id: uuid4(),
            text: "let's go",
            completed: false
        }
    ]
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTodos = filter => delay(500).then(() => {

    if (Math.random() > 0.5) {

        return Promise.reject('Boom!');
    }

    switch (filter) {
        case 'active':
            return fakeDatabase.todos.filter(t => !t.completed);
        case 'completed':
            return fakeDatabase.todos.filter(t => t.completed);
        case 'all':
        default:
            return fakeDatabase.todos;
            // throw new Error(`Unknown filter: ${filter}`);
    }
});