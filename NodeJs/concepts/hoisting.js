// ---------- hoisting inside a function (implicit global vs let) ----------
// `b` is declared with let inside the function, so reading it outside throws.
try {
    function hoisting() {
        a = 10;
        let b = 20;
    }
    hoisting()
    console.log(a);   // 10
    console.log(b);   // ReferenceError: b is not defined
} catch (e) {
    console.log("Error:", e.message);
}

// -----------------------------

console.log(test);  // undefined
var test;

console.log(test)  //undefined
var test = 10


test = 10
console.log(test)  // 10
var test

// ----------------------------------


host();
function host() {
    console.log("hoisting")
}
