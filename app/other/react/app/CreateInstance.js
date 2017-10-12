
import update from 'update';
// import shallowEqual from 'fbjs/lib/shallowEqual';
import shallowEqual from 'fb/shallowEqual';

export default (function () {
    log('Create CreateInstance: '+((new Date()).getTime())+'. I\'m using two time require("app/CreateInstance") and this function is called only once, that mean "require" is Singleton')

    var one = {one: 'two', three: 'four', six: ['seven', 'eight']};

    var two = one;

    var three = Object.assign({}, one);

    // change value
    var four = three;
    four.three = 'changed';

    // https://facebook.github.io/react/tutorial/tutorial.html#data-change-without-mutation
    var five = {...one, three: 'changed'} // new object not mutated {score: 2}

    return {
        CreateInstance: 'instance',
        immutable_tests : {
            one,
            two,
            one1two: one === two,
            one1two_shallow: shallowEqual(one, two),
            three,
            one2three: one === three,
            one2three_shallow: shallowEqual(one, three),
            four,
            one3four: one === four,
            one3four_shallow: shallowEqual(one, four),
            five,
            one4five: one === five,
            one4five_shallow: shallowEqual(one, five),

        },
        strToArray: Object.values('sp littóochars')
    }
}())