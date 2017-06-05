function component () {
    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = _.join(['Hello2','webpack2'], ' ');

    return element;
}

document.body.appendChild(component());




