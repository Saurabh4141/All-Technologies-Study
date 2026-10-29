let obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
}

// Flatten the above object : 
// output expected : [1,2,3]

const flattenObj = (obj)=>{
let result = [];
for(let key in obj){
    if(typeof obj[key] !="object"){
        result.push(obj[key])
    }else{
      result.push(...flattenObj(obj[key]))
    }
} 
return result;
}
const flattenObjResult = flattenObj(obj);
console.log(flattenObjResult)

 
 
 

 