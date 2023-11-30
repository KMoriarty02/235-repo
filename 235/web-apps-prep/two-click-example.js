function clickOne() {
    console.log("Click 1");
}

function clickTwo() {
    console.log("click 2");
}

var button = makeMeAButton();

button.onclick = click1();
button.onclick = click2(); // Will override c1
button.onclick = null; // clears the listener

// INSTEAD
var button2 = makeMeAButton();
button2.addListener("click", click1);
button2.addListener("click", click2);

button2.removeListener("click", click2);