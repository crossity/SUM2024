const host = "localhost", port = 8000;
let socket, userName = "Guest";

// Buttons initialization function.
function initializeInput() {
    let userNameSubmit = document.getElementById("userNameSubmit");
    let userNameText = document.getElementById("userNameText");

    userNameSubmit.addEventListener("click", () => {
        console.log(userNameText.value);
        userName = userNameText.value;
        sessionStorage.setItem("userName", userName);
    });
} // End of 'InitializeInput' function

// Comunication initialization function.
function initializeCommunication() {
    socket = new WebSocket(`ws://${host}:${port}`);

    socket.onopen = (event) => {
        console.log("Socket open");
        // socket.send("Hello from socket");
    }

    socket.onmessage = (event) => {
        // console.log(`Host send me: ${event.data}`);
        console.log(event.data);
    }
} // End of 'initializeCommunication' function

// Main program initialization function.
function main() {
    console.log("Client js file loaded");

    initializeCommunication();
    initializeInput();
} // End of 'main' function

// Initialization
window.addEventListener("load", () => {
    main();
}); // End of Event listener

/* Example of message sending
setInterval(() => {
    if (socket.bufferedAmount == 0) {
      socket.send("LOL");
    }
  }, 100);
*/