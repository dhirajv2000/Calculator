function isDigit(str){
    return /^\d+$/.test(str);
}

function top(array) {
    return array.slice(-1)[0]
}

function precedence(operator) {
    if (operator == '+' || operator == "-") return 1;
    if (operator == '*' || operator == "/" || operator =="%") return 2;
    return 0
}

function performOperation (value1, value2, operator) {
    if(operator == '%') return value1 % value2;
    if(operator == '/') return value1 / value2;
    if(operator == '*') return value1 * value2;
    if(operator == '+') return value1 + value2;
    if(operator == '-') return value1 - value2;
}

function evaluate(tokens) {
    let valueStack = [];
    let operatorStack = [];

    for(let index = 0; index < tokens.length; index++) {

        if (tokens[index] == " ") {
            continue
        } 
        
        else if (tokens[index] == "(") {
            operatorStack.push(tokens[index])
        }

        else if (parseFloat(tokens[index])) {
            let stringval = ""
            while(index < tokens.length && (parseFloat(tokens[index]) || tokens[index] == ".")){
                stringval += tokens[index].toString();
                index++
            }
            valueStack.push(parseFloat(stringval));
            index --;
        }

        else if (tokens[index] == ")") {
            while(operatorStack.length != 0 && top(operatorStack) != "(") {
                let value2 = valueStack.pop()
                let value1 = valueStack.pop()
                let operator = operatorStack.pop();
                valueStack.push(performOperation(value1, value2, operator))
            }
            operatorStack.pop();
        }

        else {
            while(operatorStack.length !=0 && precedence(top(operatorStack)) >= precedence(tokens[index])){
                let value2 = valueStack.pop()
                let value1 = valueStack.pop()
                let operator = operatorStack.pop();
                valueStack.push(performOperation(value1, value2, operator))
            }
            operatorStack.push(tokens[index])
        }

    }

    while(operatorStack.length !=0 ) {
        let value2 = valueStack.pop()
        let value1 = valueStack.pop()
        let operator = operatorStack.pop();
        valueStack.push(performOperation(value1, value2, operator))
    } 
    return parseFloat(top(valueStack).toFixed(7)).toString();
}
