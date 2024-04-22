class MyClass {
    private _name: string;
    private _age: number;

    constructor(name: string, age: number) {
        this._name = name;
        this._age = age;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get age(): number {
        return this._age;
    }

    set age(value: number) {
        this._age = value;
    }

    describe(): string {
        return `Name: ${this._name}, Age: ${this._age}`;
    }
}

interface MyInterface {
    name: string;
    age: number;
    describe(): string;
}

function printDetails(obj: MyInterface): void {
    console.log(obj.describe());
}

function createObject(name: string, age: number): MyInterface {
    return new MyClass(name, age);
}

function main(): void {
    const obj = createObject('John Doe', 30);
    printDetails(obj);
}

// Filling the file with more lines of code
for (let i = 0; i < 100; i++) {
    console.log(`This is line number ${i + 10}`);
}

main();
