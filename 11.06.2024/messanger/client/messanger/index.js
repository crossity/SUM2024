const host = "localhost", port = 8000;
let socket, userName, send = false;

function clearScroll() {
    let divScroll = document.getElementById("scroll");
    divScroll.innerHTML = "";
}

function makeSlide() {
    $(".user-message:last-of-type").hide().slideDown("fast");
}

function addMessage(m) {
    let divScroll = document.getElementById("scroll");
    if (m.user == userName)
        divScroll.innerHTML += `<div class="user-message"><div class="username">${m.user}</div><p>${m.text}</br></p></div>`;
    else
        divScroll.innerHTML += `<div class="message"><div class="username">${m.user}</div><p>${m.text}</br></p></div>`;
    // divScroll.innerHTML += `${m.user}: ${m.text}</br></p>`

    divScroll.scrollTop = divScroll.scrollHeight;

    /*
    $(".user-message:last-of-type").hide();
    $(".user-message:last-of-type").slideDown("slow");
    */
   //  makeSlide();
}

function sendMessage(m) {
    if (socket.bufferedAmount == 0) {
        socket.send(JSON.stringify(m));
    }
    send = true;
}

// Buttons initialization function.
function initializeInput() {
    let messageSubmit = document.getElementById("messageSubmit");
    let messageText = document.getElementById("messageText");

    messageText.addEventListener("keydown", (event) => {
        if (event.key == 'Enter') {
            console.log(messageText.value);
            // userName = messageText.value;
            sendMessage({user: userName, text: messageText.value});
            messageText.value = ""; 
        }
    });

    messageSubmit.addEventListener("click", () => {
        console.log(messageText.value);
        // userName = messageText.value;
        sendMessage({user: userName, text: messageText.value});
        messageText.value = "";
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

        clearScroll();

        const data = JSON.parse(event.data);
        for (let m of data) {
            console.log(m);
            addMessage(m);
        }
        if (send)
            makeSlide(), send = false;
    }

    userName = sessionStorage.getItem("userName");
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