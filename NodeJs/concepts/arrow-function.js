// normal function

let normal =function(){
    console.log("normal")
}
normal();

// arrow function
let arrow = ()=> console.log("arrow")
arrow()

/*------------------------------------------------------*/

let testThisinNormalFun=function (){
    console.log("N this: ", this)
}

testThisinNormalFun();

let testThisinArrowFun = ()=> console.log("A this:", this)

testThisinArrowFun()



