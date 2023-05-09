

const data = 12345;

export function getData() {
    return data;
}

export let testValue = "text";

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export let obj = {
    a: 12,
    b: 45
};

export class Person {
    constructor(name) {
        this.name = name;
    }
}

// Wszystkie powyższe z słowem export można zaimportować 
// w innym module za pomocą * czyli
// import * as myModule from "./test-modules.js"
// import {getData, Person, multiply as multiply2} from "./test-modules.js"

// export domyślny
// import myDefault from "./test-modules.js"
export default {
    getData: getData,
    value: "test!"
};


