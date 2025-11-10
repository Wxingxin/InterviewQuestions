function Person(name, age, height, address) {
  this.name = name;
  this.age = age;
  this.height = height;
  this.address = address;
}

Person.prototype.running = function () {
  console.log("running");
};
Person.prototype.eating = function () {
  console.log("eating");
};

function Student(name, age, height, address, sno, score) {
  this.name = name;
  this.age = age;
  this.height = height;
  this.address = address;
  this.sno = sno;
  this.score = score;
}
Student.prototype.running = function () {
  console.log("running");
};
Student.prototype.eating = function () {
  console.log("eating");
};
Student.prototype.studying = function () {
  console.log("studying");
};
