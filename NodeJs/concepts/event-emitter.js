const EventEmitter = require('events');

let event = new EventEmitter();

// ---------- event: abc ----------
event.on('abc', () => {
    console.log("jjjdjjdh");
})

event.emit('abc')


// ---------- event: myEvent ----------
// Registering to myEvent
event.on('myEvent', (msg) => {
    console.log(msg);
});

// Triggering myEvent
event.emit('myEvent', "First event");
