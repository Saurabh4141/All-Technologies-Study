// ---------- closure: inner function reads outer variable ----------
function closure() {
    let test = "something";
    function inner() {
        console.log(test);
    }
    inner();
}

closure();

/*--------------------------------------------------------------*/

// ---------- closure: private counter ----------
let counter = (function () {
    let privateCounter = 0;
    function changeBy(val) {
        privateCounter += val
    }

    return {
        increment: function () {
            changeBy(1)
        },
        decrement: function () {
            changeBy(-1)
        },
        value: function () {
            return privateCounter
        }
    }
})();

console.log(counter.value())
counter.increment()
console.log(counter.value())
counter.increment()
console.log(counter.value())
