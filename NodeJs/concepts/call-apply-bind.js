// ---------- call ----------
{
    function callDemo(message) {
        console.log(message + ' ' + this.name)
    }

    let obj = { name: "abc" }

    callDemo.call(obj, 'welcome')
}


// ---------- bind (example 1) ----------
{
    function hello(thing) {
        console.log(this.name + " says hello " + thing);
    }

    var helloFunc = hello.bind({ name: "Jim Smith" });
    helloFunc("world");
}


// ---------- bind (example 2) ----------
{
    function bindExample(a) {
        console.log(`Hello ${this.name} welcome to ${a}`);
    }

    let obj = { name: 'nitin' }

    let result = bindExample.bind(obj);

    result('pune')
}
