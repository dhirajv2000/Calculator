function Button(name, callBack) {
    this.name = name;
    this.callBack = callBack;
    this.getDiv = function() {
        let button = document.createElement('div');
        button.setAttribute('id', name);
        button.textContent = name;
        button.onclick = callBack;
        return button;
    }
}