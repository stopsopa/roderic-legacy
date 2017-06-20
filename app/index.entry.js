function component () {
    var element = document.createElement('div');

    /* lodash is required for the next line to work */
    element.innerHTML = ['Hello2', 'webpack2', 'included', 'and', 'works', '-', 'just', 'array.join'].join(' - ')

    return element;
}

setTimeout(function () {
    document.body.appendChild(component());
}, 1000);




