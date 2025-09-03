const { io } = require("socket.io-client");
const readline = require("readline");

const socket = io("http://localhost:3000");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let ticketId = null;
const sender = "customer";


async function start() {
    const res = await fetch("http://localhost:5000/createticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: 1,
            orderId: 123,
            issueType: "Payment",
            message: "Hello I need to support"
        })
    })
    const data = await res.json();
    ticketId = data.ticket.id;
    console.log("Ticket created with ID:", ticketId);

    socket.emit("joinRoom", ticketId, sender);
}
start()


socket.on("connect", () => {
    console.log("Customer connected");
    console.log("Type your message and press Enter...");
});

rl.on("line", (input) => {
    if (!ticketId) {
        console.log("Ticket is not created yet. Please wait...");
        return;
    }
    socket.emit("chatMessage", { ticketId, sender, text: input });
});

socket.on("chatMessage", ({ sender: s, text }) => {
    if (s !== sender) console.log(` ${s}: ${text}`);
});
