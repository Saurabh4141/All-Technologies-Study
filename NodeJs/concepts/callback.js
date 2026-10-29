// ---------- callback (direct call) ----------
{
    function greet(callback) {
        console.log("greet");
        callback()
    }

    function callbackFun() {
        console.log("I am callback function")
    }

    greet(callbackFun)
}

/*--------------------------------------------------------------*/

// ---------- callback (with setTimeout, runs after 2 seconds) ----------
{
    function greet(callback) {
        console.log('greet');

        callback()
    }

    function callbackFun() {
        console.log('I am callback fun')
    }

    setTimeout(greet, 2000, callbackFun);
}
