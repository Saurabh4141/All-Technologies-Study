const pms1 = Promise.resolve(1);
// setTimeout(function, milliseconds, param1, param2, ...)
const pms2 = new Promise((resolve, reject) => {
  // setTimeout(resolve, 200, 2);
  resolve(2)
});
const pms3 = new Promise((resolve, reject) => {
  // setTimeout(resolve, 100, 3);
  reject(3)
});
const pmsAry = [pms1, pms2, pms3];

Promise.all(pmsAry)
  .then(resAry => console.log("resAry",resAry)) // resAry order is same as pmsAry order
  .catch(error => console.log("error",error));  // pms3 rejects, so this prints: error 3

  Promise.allSettled(pmsAry)
.then(resAry => console.log(resAry));