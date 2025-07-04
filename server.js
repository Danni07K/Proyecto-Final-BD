const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3005;
const MONGO_URI = process.env.MONGODB_URI;

// Conexión a MongoDB
async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  return mongoose.connection;
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Socket.io setup
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Presencia en memoria: { [classId]: Set de usuarios }
  const classPresence = {};

  io.on('connection', (socket) => {
    let currentClassId = null;
    let currentUser = null;

    // Unirse a una sala de clase
    socket.on('join-class', (classId, user) => {
      currentClassId = classId;
      currentUser = user;
      socket.join(classId);
      // Registrar presencia
      if (!classPresence[classId]) classPresence[classId] = new Set();
      classPresence[classId].add(JSON.stringify(user));
      // Emitir lista actualizada
      const users = Array.from(classPresence[classId]).map(u => JSON.parse(u));
      io.to(classId).emit('presence-update', users);
      // Notificar a otros
      socket.to(classId).emit('user-joined', user);
    });

    // Mensaje de chat
    socket.on('chat-message', async ({ classId, message }) => {
      io.to(classId).emit('chat-message', message);
      // Guardar mensaje en MongoDB
      try {
        const db = (await connectMongo()).db;
        await db.collection('chat_lobby').insertOne({
          ...message,
          classId,
          created_at: new Date(),
        });
      } catch (e) {
        // Puedes loguear el error si lo deseas
      }
    });

    // Desconexión
    socket.on('disconnecting', () => {
      if (currentClassId && currentUser && classPresence[currentClassId]) {
        classPresence[currentClassId].delete(JSON.stringify(currentUser));
        // Emitir lista actualizada
        const users = Array.from(classPresence[currentClassId]).map(u => JSON.parse(u));
        setTimeout(() => {
          io.to(currentClassId).emit('presence-update', users);
        }, 100); // Pequeño delay para asegurar desconexión
      }
    });
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}); 