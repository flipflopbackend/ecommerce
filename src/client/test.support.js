const { io } = require("socket.io-client");
const readline = require("readline");

const socket = io("http://localhost:3000");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

let ticketId = null;
const sender = "support";


async function start() {
    const res = await fetch("http://localhost:5000/alltickets")
    const data = await res.json()
    if (!data.tickets) {
        console.log("No tickets available");
        return

    }
    ticketId = data.tickets.id
    console.log("Joining ticket:", ticketId);
    socket.emit("joinRoom", ticketId, sender);
}
start()

socket.on("connect", () => {
    console.log(" Support connected");
    console.log("Type your reply and press Enter...");
});

rl.on("line", (input) => {
    if (!ticketId) {
        console.log("Ticket not joined yet. Wait a moment...");
        return;
    }
    socket.emit("chatMessage", { ticketId, sender, text: input });
});

socket.on("chatMessage", ({ sender: s, text }) => {
    if (s !== sender) console.log(` ${s}: ${text}`);
});
