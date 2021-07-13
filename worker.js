importScripts('evaluate.js');
onmessage = function(e) {
    let tokens = e.data
    postMessage([evaluate(tokens)])
}


