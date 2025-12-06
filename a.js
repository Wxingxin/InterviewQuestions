const arr = [1, 2, 3, 3, 4, 6, 6, 5];

const a1 = [...new Set(arr)]
console.log(a1)

const a2 = Array.from(new Set(arr))
console.log(a2)

const a3 = []
const map = new Map()
for(let item of arr){
  if(!map.has(item)){
    map.set(item,true)
    a3.push(item)
  }
}
console.log(a3)

const obj = {}
const a4 = []
for(let item of arr){
  if(!obj[item]){
    obj[item] = true
    a4.push(item)
  }
}
console.log(a4)

const a5 = []
for(let i = 0; i < arr.length; i++){
  if(!a5.includes(arr[i])){
    a5.push(arr[i])
  }
}
console.log(a5)

const a6 = arr.filter((item, index) => {
  return arr.indexOf(item) === index
})
console.log(a6)

