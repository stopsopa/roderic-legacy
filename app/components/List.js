
import React from 'react';

const List = ({ list }) => (
    <ul>
        {list.map(item =>
            <li>{{item}}</li>
        )}
    </ul>
);

export default List;