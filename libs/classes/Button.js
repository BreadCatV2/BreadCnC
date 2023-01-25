class Button {
    constructor(name, func) {
        this.name = name;
        this.func = func;
    }

    getName() {
        return this.name;
    }
    run(...args) {
        this.func(...args);
    }
}

//turn the function to a string
module.exports = {
    Button
}