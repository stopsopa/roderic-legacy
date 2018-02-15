
import React from 'react';

import './LayoutPadding.scss';

export default ({ children, ...props }) => {

    return (
        <div className="layout-padding" {...props}>
            {children}
        </div>
    );
}