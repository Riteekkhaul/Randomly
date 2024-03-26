const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

const activeUsers = {};


io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);
  socket.on("room:join", (data) => {
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    activeUsers[socket.id] = room;
    io.to(socket.id).emit("room:join", data);
  });

// code for chat 

socket.on('sendMessage', (data) => {
  const room = activeUsers[socket.id];
  console.log(data);
  const { text, sender } = data;
  io.to(room).emit('message', { user: socket.id, text: text ,sender: sender});
});

socket.on('disconnect', () => {
  console.log('User disconnected:', socket.id);
  const room = activeUsers[socket.id];
  if (room) {
    io.to(room).emit('message', { user: 'admin', text: `User ${socket.id} has left the room` });
    delete activeUsers[socket.id];
  }
});


// code end for chat

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
