function Calculator() {
    const grid = document.querySelector('.grid');
    let textBox = document.querySelector('.textbox')
    let expressionBox = document.querySelector('.expressionbox')
    let expressionArray = [];
    const self = this;
    let bracketCount = 0;
    const buttonNames = [
        "AC", "⌫", "%", "/",
        "7", "8", "9", "*",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        "(", "0", ")", "=", ".", "+/-"
    ];

    //Balance Expression
    this.balanceExpression = function (expression) {
        for (let count = 1; count <= bracketCount; count++) {
            expression.push(")")
        }
        expressionBox.textContent = expression.join("") + " =";
        return expression;
    }

    //Sends the expression to the worker for evaluation
    this.evalWorker = function (expression) {
        let myWorker = new Worker("worker.js")
        myWorker.postMessage(expression)
        myWorker.onmessage = function (e) {
            bracketCount = 0;
            expressionArray = []
            expressionArray.push(e.data)
            textBox.textContent = expressionArray.join("")
            myWorker.terminate();
        }
    }

    //Handles button clicks
    this.clickHandler = function () {
        //Clear Screen
        if (this.id === "AC") {
            bracketCount = 0;
            expressionArray = [];
            expressionBox.textContent = "";
            textBox.textContent = "";
        } 
        //Backspace
        else if (this.id === "⌫") {
            if(parseFloat(expressionArray[expressionArray.length-1])){
                expressionArray[expressionArray.length - 1] = expressionArray[expressionArray.length - 1].slice(0, -1);
                if(expressionArray[expressionArray.length - 1] == "") expressionArray.pop()
            }
            else {
                expressionArray.pop()
            }
            textBox.textContent = expressionArray.join("")
        } 
        //Equal to
        else if (this.id === "=") {
            if (expressionArray.length == 0) return;
            if (["+", "-", "/", "*", "%"].indexOf(expressionArray[expressionArray.length -2]) != -1 
            || expressionArray[expressionArray.length - 1] == "(") return;
            self.evalWorker(self.balanceExpression(expressionArray));
            textBox.textContent = ""
        } 
        //Operators
        else if (["+", "-", "/", "*", "%"].indexOf(this.id) > -1) {
            if (expressionArray.length == 0) return;
            if (["+", "-", "/", "*", "%"].indexOf(expressionArray[expressionArray.length -2]) == -1) {
                expressionArray.push(...[" ", this.id, " "])

            } else {
                expressionArray.splice(-2)
                expressionArray.push(...[this.id," "])
            }
            textBox.textContent = expressionArray.join("")

        } 
        //Brackets
        else if (this.id == "(") {
            bracketCount++;
            if(parseFloat(expressionArray[expressionArray.length - 1]) || expressionArray[expressionArray.length - 1] == ")"){
                
                expressionArray.push(...[" ","*"," ", "("])
            }else {
                expressionArray.push(this.id)
            }
            textBox.textContent = expressionArray.join("")
        } 
        
        else if (this.id == ")") {
            if (!(bracketCount <= 0)) {
                bracketCount--;
                if(expressionArray[expressionArray.length -1] == "(") {
                    expressionArray.push(...["0", this.id])
                } else {
                    expressionArray.push(this.id)
                }
                textBox.textContent = expressionArray.join("")
            }
        } 
        //Sign change
        else if (this.id == "+/-") {
            let number = expressionArray[expressionArray.length - 1];
            if (parseFloat(number)) {
                number = (parseFloat(number) * -1).toString();
                expressionArray[expressionArray.length -1] = number
                textBox.textContent = expressionArray.join("")
            }
        } 
        //Numbers
        else {
            let number = expressionArray[expressionArray.length - 1];
            if (parseFloat(number)) {
                number += this.id;
                expressionArray[expressionArray.length -1] += this.id
            } else {
                expressionArray.push(this.id)
            }
            textBox.textContent = expressionArray.join("")
        }
    }

    //Loads the  calculator
    this.intialiseCalculator = function () {
        for (let i = 0; i < 22; i++) {
            let button = document.createElement('div');
            button.setAttribute('id', buttonNames[i]);
            button.textContent = buttonNames[i];
            button.onclick = self.clickHandler;
            grid.appendChild(button);
        }
    }
}
const cl = new Calculator();
cl.intialiseCalculator();