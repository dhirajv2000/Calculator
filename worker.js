importScripts('evaluate.js');
onmessage = function(e) {
    let tokens = e.data.toString();
    tokens = tokens.replace(/(\)|\d+(?!\d)\.?)(?=[(\d.+-])/g, '$1*')
    tokens = tokens.replaceAll(".*", ".")
    tokens = tokens.replace(" - "," - 1 * ")
    //console.log(evaluate(["8.2", "*",  "-4"]))
    postMessage([evaluate(tokens)])
}


