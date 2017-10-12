
import React from 'react';
import PropTypes from 'prop-types';
import trim from 'lodash/trim';

import './FacebookPlaceholder.scss';

const FacebookPlaceholder = ({ children, ...rest }) => {
    return (
        <div className="facebook-paragraph" {...rest}>
            {children}
        </div>
    );
};

FacebookPlaceholder.p = ({ children, numberOfWords, wordLength, ...rest }) => {

    let newChildren = [];

    if ( typeof numberOfWords !== 'undefined') {

        numberOfWords = parseInt(numberOfWords, 10);

        if (numberOfWords < 1) {

            throw `numberOfWords can't be negative or equal 0, given value is: '${numberOfWords}'`;
        }

        if ( typeof wordLength === 'undefined' ) {

            wordLength = 8;
        }
        else {

            wordLength = parseInt(wordLength, 10);
        }

        if (wordLength < 1) {

            throw `wordLength can't be negative or equal 0, given value is: '${wordLength}'`;
        }


        const word = '_'.repeat(wordLength);

        children = (`${word} `).repeat(numberOfWords);
    }

    if (typeof children === 'string') {

        (children.split(/\s+/gi) || []).map((word, i) => {
            newChildren.push(<span key={`p-${i}`} className="p">{word}</span>);
            newChildren.push(<span key={`s-${i}`} className="s">{' '}</span>);
        });
    }

    return (
        <p {...rest}>{newChildren}</p>
    )
}
FacebookPlaceholder.p.propTypes = {
    children: PropTypes.string,
    wordLength: PropTypes.number,
    numberOfWords: PropTypes.number
};

((d) => {
    Object.keys(d).forEach((k) => {
        FacebookPlaceholder[k] = ({ className, ...rest }) => {

            let cn = className || '';

            cn += ` ${d[k]}`;

            cn = trim(cn);

            return (
                <div className={cn} {...rest} />
            )
        }
        FacebookPlaceholder[k].propTypes = {
            className: PropTypes.string
        }
    })
})({
    box: 'fp-box',
    belt: 'fp-belt'
});

export default FacebookPlaceholder;