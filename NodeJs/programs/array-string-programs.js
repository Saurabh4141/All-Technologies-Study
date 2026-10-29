/*  ******************* remove duplicates from array ************************ */

// let arr = [1, 2, 3, 4, 1, 4, 3]

// let unique = [...new Set(arr)]

// let unique = arr.filter((ele, index) => {
//     return arr.indexOf(ele) === index
// })


// let unique = []
    // for(let ele of arr){
    //     if(!unique.includes(ele)){
    //         unique.push(ele)
    //     }
    // }


    // let unique = arr.reduce((acc, current) => {
    //     if (!acc.includes(current)){
    //         acc.push(current)
    //     }
    //     return acc
    // }, [])


/*  ******************* print duplicates from array ************************ */

// let arr = [1, 2, 3, 4, 1, 4, 3]
// let output = arr.filter((ele, index)=>{
//     return arr.indexOf(ele) !== index
// })


// let duplicates = []
//     for (let i = 0; i < arr.length; i++) {
//         for (let j = 0; j < arr.length; j++) {
//             if (i !== j && arr[i] == arr[j] && !duplicates.includes(arr[i])) {
//                 duplicates.push(arr[i])
//             }
//         }
//     }


/*  ******************* find second max value in array ************************ */

// let arr = [1, 2, 3, 4, 1, 40, 30];

// let max = -Infinity
// let secondMax = -Infinity;
// for (let ele of arr) {
//     if (ele > max) {
//         secondMax = max;
//         max = ele;
//     }else if(ele > secondMax && ele < max){
//         secondMax = ele
//     }
// }


// let unique = [...new Set(arr)]
// let max = Math.max.apply(null,unique);
// unique.splice(unique.indexOf(max),1)
// let secondMax = Math.max.apply(null,unique)


// arr = arr.sort((a, b) => b - a);
    // arr = [... new Set(arr)]
    // let secondMax = arr[1]


/*  ******************* find second min value in array ************************ */

// let arr = [1, 2, 3, 4, 1, 40, 30];

// let first = Infinity;
// let second = Infinity;
// for(let ele of arr){
//     if(ele < first){
//         second = first
//         first = ele
//     }else if( ele > first && ele < second ){
//         second = ele
//     }
// }


// let unique = [...new Set(arr)]
// let min = Math.min.apply(null,unique);
// unique.splice(unique.indexOf(min),1)
// let secondMin = Math.min.apply(null,unique)


// let secondMin = [...new Set(arr)].sort((a,b)=> a-b)[1]



/*  ******************* find count of each character in string ************************ */

// let str = 'nitin';
// let arr = str.split('')
// let uniqueValue = [...new Set(arr)];

// for(let ele of uniqueValue){
//     let count = str.split(ele).length -1
//     console.log(`${ele} : ${count}`)
// }



// let str = 'nitin'
// let countObj ={}
// for(let char of str){
//     if(char in countObj){
//         countObj[char] += 1
//     }else{
//         countObj[char] = 1
//     }
// }



// let countObj = str.split('').reduce((acc, current) => {
//     if (acc[current]) {
//         acc[current] = acc[current] + 1
//     } else {
//         acc[current] = 1
//     }
//     return acc
// }, {})



/*  ******************* reverse the array ************************ */
// let arr = [1, 2, 3, 4, 1, 4, 3]

// let leftIndex = 0
// let rightIndex = arr.length -1;
// while(leftIndex < rightIndex){
//     let temp = arr[leftIndex];
//     arr[leftIndex] = arr[rightIndex]
//     arr[rightIndex] = temp

//     leftIndex ++
//     rightIndex --
// }


// let reverse = [];
// for(let ele of arr){
//     reverse.unshift(ele)
// }
// console.log(reverse)


// let middle = Math.floor(arr.length / 2)
// let arrLength = arr.length
// for (let i = 0; i < middle; i++) {
//     let temp = arr[i]
//      arr[i] = arr[arrLength - i -1]
//     arr[arrLength - i -1] = temp

// }
// console.log(arr);


/*  ******************* Find two arrays equal or not ************************ */

// let arr1 = [1, 2, 3, 3, 4]
// let arr2 = [1, 2, 3, 4, 5]
// function matchArray(arr1, arr2) {
//     if (arr1.length !== arr2.length) {
//         return false
//     }
//     let matchObj1 = {};
//     let matchObj2 = {};
//     for (let ele of arr1) {
//         matchObj1[ele] = matchObj1[ele] ? (matchObj1[ele] + 1) : 1
//     }
//     for (let ele of arr2) {
//         matchObj2[ele] = matchObj2[ele] ? (matchObj2[ele] + 1) : 1
//     }
//     for(let ele in matchObj1){
//         if(matchObj1[ele] !== matchObj2[ele]){
//             return false
//         }
//     }
//     return true

// }
// let result = matchArray(arr1, arr2)


// let arr1 = [1, 2, 3, 3, 4]
// let arr2 = [1, 2, 3, 4, 3]

// let sorted2 = [...arr2].sort()
// let isSame = arr1.length == arr2.length && [...arr1].sort().every((ele, index)=>{
//     return ele === sorted2[index]
// })


/*  ******************* Find intersection of two arrays ************************ */

// let arr1 = [1, 2, 3, 3, 4]
// let arr2 = [1, 2, 3, 4, 3, 6, 33]

// let intersection = [...new Set(arr1.filter((ele)=>{
//     return arr2.includes(ele)
// }))]


/*  ******************* Find union of two arrays ************************ */

// let arr1 = [1, 2, 3, 3, 4]
// let arr2 = [1, 2, 3, 4, 3, 6, 33]

// let union = [ ... new Set([...arr1, ...arr2])]


/*  ******************* Reverse a string ************************ */

// let str = 'jjhtdssd';

// let reverse = str.split('').reverse().join('')

// let reverse = ''
// for (let ele of str) {
//     reverse = ele + reverse
// }


/*  ******************* Check the string is palindrome or not ************************ */

// let str = 'nitin';

// let reverse = ''
// for (let ele of str) {
//     reverse = ele + reverse
// }
// if(str === reverse){
//     console.log('String is Palindrome')
// }else{
//     console.log('String is not Palindrome')
// }


// let isPalindrome = str.split('').every((ele,index)=>{
//     if(ele === str[str.length - index -1]){
//         return true
//     }else{
//         return false
//     }
// })


/*  ******************* Reverse the integer ************************ */

// let integer = 56

// let reverse = integer.toString().split('').reverse().join('')
// reverse = parseInt(reverse)* Math.sign(integer)



/*  ******************* Add element to array in particular position ************************ */

// let arr = [10, 3, 26, 44, 59, 9];
// let newEle = 889
// let pos = 2

// for (let i = arr.length - 1; i >= 0; i--) {
//     if (i >= pos) {
//         arr[i + 1] = arr[i]
//         if (i == pos) {
//             arr[i] = newEle
//         }
//     }
// }



/*  ******************* Delete element from array in particular position ************************ */

// let arr = [10, 3, 26, 44, 59, 9];
// let pos = 2

// for (let i = pos; i < arr.length - 1; i++) {
//     arr[i] = arr[i + 1]
// }
// arr.pop()



/*  ******************* Merge two arrays ************************ */

// let arr1 = [23, 4, 33, 56, 8, 21]
// let arr2 = [54, 33, 9, 67, 92]
// let arr3 = [];

// for (let i = 0; i < arr1.length; i++) {
//     arr3[i] = arr1[i]
// }

// for (let  j= 0; j < arr2.length; j++) {
//     arr3[arr1.length + j] = arr2[j]
// }




// let data1 = [3, 7, 12, 34, 56, 90]
// let data2 = [4, 9, 25, 45]
// let data3 = [];
// let d1 = 0
// let d2 = 0
// let d3 = 0

// while (d1 < data1.length && d2 < data2.length) {
//     if (data1[d1] < data2[d2]) {
//         data3[d3] = data1[d1];
//         d1++;
//     } else {
//         data3[d3] = data2[d2];
//         d2++;
//     }
//     d3++
// }

// while (d1 < data1.length) {
//     data3[d3] = data1[d1];
//     d1++;
//     d3++;
// }

// while (d2 < data2.length) {
//     data3[d3] = data2[d2];
//     d2++;
//     d3++;
// }



/*  ******************* Sort the array ************************ */

// let arr = [1, 7, 2, 8, 3, 4, 5, 0, 9]

// for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//         if (arr[i] > arr[j]) {
//             let temp = arr[i]
//             arr[i] = arr[j]
//             arr[j] = temp
//         }
//     }
// }




/*  ******************* Array flat method implementation ************************ */

// let arr = [1, 2, [3, 4, [5, 6, [7, [8, 9]]]]]
// function flatten(arr){
//     let newArr = arr.reduce((acc, item) => {
//         if (Array.isArray(item)) {
//             acc = acc.concat(flatten(item))
//         } else {
//             acc.push(item)
//         }
//         return acc
//     }, [])

//     return newArr
// }
// let result = flatten(arr)


// let arr = [1, 2, [3, 4, [5, 6, [7, [8, 9]]]]]
// let deep = 2
// function flatten (arr,deep){
//     let output =[]
//     for(let ele of arr){
//         if(Array.isArray(ele) && deep){
//             output =  output.concat(flatten(ele,deep -1))
//         }else{
//             output.push(ele)
//         }
//     }
//     return output
// }

// let result = flatten(arr,deep)


/*  ******************* Count Distinct element in every k size window ************************ */

// let arr = [5, 4, 1, 1, 3, 4, 1, 4, 5, 5]
// let k = 3

// for (let i = 0; i <= arr.length - k; i++) {
//     let count = [... new Set(arr.slice(i, k + i))].length
//     console.log(count);
// }


/*  ******************* Program to find a missing number in an integer array ************************ */

// let arr = [1, 2, 4, 5]
// let len = arr.length + 1

// let sum1 = (len * (len + 1)) / 2
// let sum2 = 0
// for (let i = 0; i < arr.length; i++) {
//     sum2 = sum2 + arr[i]
// }
// let missingNum = sum1 - sum2



/*  ******************* Program to find continuous sub array whose sum is equal to a given number ************************ */

// let arr = [5, 4, 1, 2, 3, 4, 1, 4, 5, 5]
// let ele = 10
// for (let i = 0; i < arr.length; i++) {
//     let sum = 0;
//     for (let j = i; j < arr.length; j++) {
//         sum = sum + arr[j];
//         if (sum == ele) {
//             console.log(arr.slice(i, j + 1));
//         }
//     }
// }



/*  ******************* Maximum consecutive ones (or zeros) in an array ************************ */

// let arr = [1, 0, 0, 1, 1, 1, 0, 1, 1,1,1]
// let maxOneCount = 0;
// for (let i = 0; i < arr.length; i++) {
//     let oneCount = 0;
//     for (let j = i; j < arr.length; j++) {
//         if (arr[j] == 1) {
//             oneCount = oneCount + 1;
//         } else {
//             break;
//         }
//     }
//     if(oneCount > maxOneCount){
//         maxOneCount = oneCount;
//     }
// }



// let arr = [1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1]
// let maxOneCount = 0;
// let leftIndex = 0

// while (leftIndex < arr.length) {
//     if (arr[leftIndex] == 0) {
//         leftIndex = leftIndex + 1;
//     } else {
//         let rightIndex = leftIndex;
//         while (rightIndex < arr.length - 1 && arr[rightIndex + 1] == 1) {
//             rightIndex = rightIndex + 1;
//         }

//         if ((rightIndex - leftIndex + 1) > maxOneCount) {
//             maxOneCount = rightIndex - leftIndex + 1;
//         }
//         leftIndex = rightIndex + 1;

//     }
// }


/*  ******************* Pairs of index whose sum matches the given number ************************ */

// let arr = [15, 12, 4, 16, 9, 8, 24, 0]
// let ele = 24
// for (let i = 0; i < arr.length; i++) {
//     for (let j = i; j < arr.length; j++) {
//         if (i !== j && arr[i] + arr[j] == ele) {
//             console.log(i + ' ' + j)
//         }
//     }
// }



/*  ******************* Find duplicate elements from array ************************ */

// let arr = [10, 2, 3, 2, 40, 10]
// let isDuplicate = [];
// for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length; j++) {
//         if(i !== j && arr[i] == arr[j] && !isDuplicate.includes(arr[j])){
//             isDuplicate.push(arr[j])
//         }
//     }
// }



/*  ******************* Check array contains duplicate elements ************************ */

// let arr = [10,2,3,2,40,10]
// let duplicate = arr.some((ele,index)=> arr.indexOf(ele) !== index)



/*  ******************* Convert array into Multidimensional array ************************ */

// function multiArray(arr, size) {
//     let result = []
//     let inc = -1

//     for (let i = 0; i < arr.length; i++) {
//         if (i % size == 0) {
//             inc++
//             result[inc] = []
//         }
//         result[inc].push(arr[i])
//     }

//     return result
// }
// let result = multiArray([1, 2, 3, 4, 5, 6], 2)



// const arr = [1, 2, 3, 4, 5, 6];
// let size = 7

// const newArr = [];
// while (arr.length) {
//     newArr.push(arr.splice(0, size))
// }



/*  ******************* Find duplicates in string ************************ */

// let str = 'nitin'
// let duplicates = []
// for (let i = 0; i < str.length; i++) {
//     for (let j = 0; j < str.length; j++) {
//         if(i !== j && str.charAt(i)== str.charAt(j) && !duplicates.includes(str.charAt(i))){
//             duplicates.push(str.charAt(i))
//         }
//     }
// }



// let str = 'nitin'
// let arr = str.split('')
// let duplicates = arr.filter((ele,i)=>{
//     return arr.indexOf(ele) !== i
// })




/*  ******************* Find two strings are anagram or not ************************ */

// let str1 = 'nitin'
// let str2 = 'tniin'
// function isAnagram(str1, str2) {
//     if (str1.length !== str2.length) {
//         return false
//     }
//     let freqCounter1 = {}
//     let freqCounter2 = {}
//     for (let char of str1) {
//         freqCounter1[char] = freqCounter1[char] ? (freqCounter1[char] + 1) : 1
//     }
//     for (let char of str2) {
//         freqCounter2[char] = freqCounter2[char] ? (freqCounter2[char] + 1) : 1
//     }
//     for (let key in freqCounter1) {
//         if (freqCounter1[key] !== freqCounter2[key]) {
//             return false
//         }
//     }
//     return true
// }





/*  ******************* Count number of substring in given string ************************ */


// let myString = "John Doe has 5 oranges while Jane Doe has only 2 oranges, Jane gave Mike 1 of her orange so she is now left with only 1 Orange.";
// let mySubString = "Orange";

// case-sensitive: counts only "Orange" -> 1
// let count = myString.split(mySubString).length - 1;
// console.log(count);



// let myString = "John Doe has 5 oranges while Jane Doe has only 2 oranges, Jane gave Mike 1 of her orange so she is now left with only 1 Orange.";
// case-insensitive: counts "orange" in "oranges", "orange" and "Orange" -> 4
// let regex = /orange/gi;
// let count = (myString.match(regex) || []).length;