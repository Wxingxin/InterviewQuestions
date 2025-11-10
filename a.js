class Person{
  constructor(name,age){
    this.name = name
    this.age = age;
  }

  sayHi(){
    console.log(`HI , i ${this.name}, ${this.age}`)
  }
}

const p1 = new Person("gao",22)
p1.sayHi();