import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"]
	}
});

app.get("/health", (req, res) => {
	res.json({ ok: true });
});

io.on("connection", (socket) => {
	console.log(" ")
	console.log("a user connected:", socket.id);
	
	socket.on("disconnect", () => {
		console.log("user disconnected:", socket.id);

		socket.broadcast.emit("playerLeft", socket.id);
	});
});

server.listen(3000, () => {
	console.log("server running on http://localhost:3000");
});