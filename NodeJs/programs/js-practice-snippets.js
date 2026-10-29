/* ============================================================================
   JS practice snippets (merged from two old test.js files)
   Part 1: array / closure / polyfill / callback practice
   Part 2: sorting, this, flatten object, Promise & async output practice
   Most snippets are commented out. Uncomment one at a time to run it.
   ============================================================================ */

/* ============================== PART 1 =================================== */


/*  --------------------------------------------------------------------------------  */

// let a = [2, 3, 4, 5]
// let b = [6, 3, 4]
// let r = []

// let maxLengthArray = a.length > b.length ? [a, b] : [b, a]

// for (let i = 0; i < maxLengthArray[0].length; i++) {
//     let ee = (maxLengthArray[1][i] == undefined) ? 0 : maxLengthArray[1][i]
//      r.push(maxLengthArray[0][i] + ee)
// }


// console.log(r)


// ---------------------------------------------------------------

// clouser example
/*
function clouser(){
    let a = 10;
    function inner(){
        console.log(a);
    }
    inner();
}
clouser();
*/


// --------------------------------------------------------------------

// function multi(a, b) {
//     console.log(b)
//     if(b){
//         return a*b
//     }else{
//         return function (b) {
//             return a * b
//         }
//     }
// }

// let result = multi(4,5);

// https://blogs.shubhamverma.me/lets-polyfill-map-filter-and-reduce

// let arr1 = [1, 2, 3, 4, 7]
// Array.prototype.customMap = function (callbackFn) {
//     var arr = []
//     for (var i = 0; i < this.length; i++) {
//         arr.push(callbackFn(this[i], i, this));
//     }
//     return arr;
// }

// let result = arr1.customMap((el, i, arr) => {
//     return el * 2
// })

// console.log(result);




// for (let i = 0; i < buckets.length; i++) {
//     output[0].push(buckets[i].key);
//     if( i == 0){
//         for (let j = 0; j < department.buckets.length; j++) {
//             output[j + 1] = []
//             output[j+1].push(department.buckets[j].key)
//             output[j+1].push(department.buckets[j].doc_count)

//         }
//     }
// }



// if (i == 0) {
//     ele.department.buckets.forEach((item, j) => {
//         output[j + 1] = []
//         output[j + 1].push(item.key)
//         output[j + 1].push(item.doc_count)
//     })
// } else {
//     ele.department.buckets.forEach((item, j) => {
//         output[i][j + 1 + 1] = item.doc_count
//     })

// }

// console.log(output);








// let arr = [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1]

// Array.prototype.customMap = function (cb) {
//     let output = []

//     for (let i = 0; i < this.length; i++) {
//         output.push(cb(this[i], i, this))
//     }
//     return output
// }

// let result = arr.customMap((ele, index, arr) => {
//     return ele * 2
// });
// console.log(result);




// console.log('Start')

// process.nextTick(() => console.log('Queued using process.nextTick'))

// console.log('End')


// callback hell shape (the three helpers just call the callback so this runs)
const task = (cb) => cb()
const task2 = (cb) => cb()
const task3 = (cb) => cb()

task(()=>{
    task2(()=>{
        task3(()=>{
            
        })
    })
})

/* ============================== PART 2 =================================== */
// let arr = [1,4,68,9,4,6,2,34];

// for(let i=0;i<arr.length;i++){
//     for(let j=0;j<arr.length-1-i;j++){
//         if(arr[j]>arr[j+1]){
//             let temp = arr[j];
//             arr[j] = arr[j+1];
//             arr[j+1] = temp;
//         }
//     }
// }
// console.log(arr)






// let arr = [1,4,68,9,4,6,2,34];

// for(let i=0;i<arr.length;i++){
//     for(let j=0;j<arr.length-1-i;j++){
//         if(arr[j]>arr[j+1]){
           
//             let temp = arr[j];
//             arr[j] = arr[j+1];
//             arr[j+1] = temp;
//         }
//     }
// }
// console.log(arr)


// const person = {
//   name: "John",
//   greet: () => {
//     return this.name;
//   }
// };
// console.log(person.greet())


// let obj = {
//   a: 1,
//   b: {
//     c: 2,
//     d: {
//       e: 3
//     }
//   }
// }
 
// const flattenObj = (obj)=>{
// let result = [];
// for(let key in obj){
//     if(typeof obj[key] !="object"){
//         result.push(obj[key])
//     }else{
//       result.push(...flattenObj(obj[key]))
//     }
// } 
// return result;
// }
// const flattenObjResult = flattenObj(obj);
// console.log(flattenObjResult)
 

// Promise.resolve(1)
//   .then(x => x + 1)
//   .then(x => { throw new Error('error') })
//   .catch(() => 1)
//   .then(x => x + 1)
//   .then(x => console.log(x))
//   .catch(console.error);



async function processData() {
  try {
    return await Promise.reject("Error occurred");
  } catch (err) {
    console.log("Caught:", err);
  }
}
// NOTE: console.log(5) runs immediately and passes undefined to .then(),
// so 5 prints first, then "Caught: Error occurred".
// To print after processData finishes use: .then(() => console.log(5))
processData().then(console.log(5))
