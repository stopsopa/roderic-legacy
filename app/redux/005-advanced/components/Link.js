
import React from 'react';

// this component doesn't know about behaviour
// specify only appearance of link
const Link = ({
    active,
    onClick,
    children
}) => {

    if (active) {

        return <span>{children}</span>;
    }

    return (
        <a href="javascript;"
           onClick={e => {
               e.preventDefault();
               onClick();
           }}
        >
            {children}
        </a>
    )
};

export default Link;