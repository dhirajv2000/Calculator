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
        "(", "0", ")", "=", "."
    ];

    //Balance Expression
    this.balanceExpression = function (expression) {
        for (let count = 1; count <= bracketCount; count++){
            expression += ")"
        }
        expressionBox.textContent = expression + " =";
        return expression;
    }

    //Sends the expression to the worker for evaluation
    this.evalWorker = function (expression) {
        let myWorker = new Worker("worker.js")
        myWorker.postMessage([expression])
        myWorker.onmessage = function (e) {
            bracketCount = 0;
            textBox.textContent = e.data;
            myWorker.terminate();
        }
    }

    //Handles button clicks
    this.clickHandler = function () {
        if (this.id === "AC") {
            bracketCount = 0;
            expressionArray = [];
            expressionBox.textContent = "";
            textBox.textContent = "";
        } else if (this.id === "⌫") {
            textBox.textContent = textBox.textContent.slice(0, -1);
        } else if (this.id === "=") {
            self.evalWorker(self.balanceExpression(textBox.textContent));
            textBox.textContent = ""
        } else if (["+", "-", "/", "*", "%"].indexOf(this.id) > -1) {
            if(["+", "-", "/", "*", "%"].indexOf(textBox.textContent.slice(-2,-1)) == -1){
                textBox.textContent = textBox.textContent + " " + this.id + " "; 
            } else {
                textBox.textContent = textBox.textContent.slice(0,-2) + this.id + " ";
            }
            
        } else if (this.id == "(") {
            bracketCount++;
            textBox.textContent = textBox.textContent + this.id;
        } else if (this.id == ")") {
            if(!(bracketCount <=0)) {
                bracketCount--;
                textBox.textContent = textBox.textContent.slice(-1) == "(" ? textBox.textContent + "0" + this.id : textBox.textContent + this.id;  
            }
        } else {
           textBox.textContent = textBox.textContent + this.id;
        }
    }

    //Loads the  calculator
    this.intialiseCalculator = function () {
        for (let i = 0; i < 21; i++) {
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