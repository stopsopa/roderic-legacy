
let delay;

export default delay = (time, data) =>
    new Promise(resolve =>
        time ? setTimeout(resolve, time, data) : resolve(data)
    );

export const reject = (time, data) =>
    new Promise((resolve, reject) =>
        time ? setTimeout(reject, time, data) : reject(data)
    );

