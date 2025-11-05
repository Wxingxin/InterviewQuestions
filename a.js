function Person(name){
    this.name = name
}

console.log(Person.__proto__)
console.log(Person.__proto__.__proto__)
console.log(Person.__proto__.__proto__.__proto__)
console.log('---------------')
const p1 = new Person('weijiaxing')
console.log(p1.constructor);
console.log('---------------')

console.log(p1.__proto__);
console.log(p1.__proto__.__proto__);
console.log(p1.__proto__.__proto__.__proto__);