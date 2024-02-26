export default function test() {
    console.log('hello world');
}
console.log('hello world');
test();

class Test {
    constructor() {
        global.console.log('hello world');
    }
}
new Test();
