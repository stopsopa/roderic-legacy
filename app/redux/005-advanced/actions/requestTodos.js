
// action createor function
const requestTodos = (filter = 'all') => {

    return {
        type: 'REQUEST_TODOS',
        filter
    }
};

// export const fetchTodos = filter => api.fetchTodos(filter).then(
//     todos => {
//         filter = filter || 'all';
//         return receiveTodos(filter, todos)
//     }
// );

export default requestTodos;