"use client";
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';
import useSound from 'use-sound';

const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : '';

export default function LobbyClase() {
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const [estudiantes, setEstudiantes] = useState([]);
  const [chat, setChat] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const chatRef = useRef(null);
  const socketRef = useRef(null);
  const [allEstudiantes, setAllEstudiantes] = useState([]); // Historial de todos los estudiantes
  const [socketConnected, setSocketConnected] = useState(true);
  const [playJoin] = useSound('/sounds/energia-maldita.mp3', { volume: 0.3 });
  const [playLeave] = useSound('/sounds/energia-maldita.mp3', { volume: 0.15 });

  // Demo: obtener datos del usuario y clase (reemplazar por lógica real)
  const user = {
    nombre: 'Tú', // TODO: reemplazar por el nombre real del usuario
    avatar: '/avatars/avatar-megumi.png', // TODO: avatar real
    personaje: 'Megumi Fushiguro', // TODO: personaje real
  };

  // Conexión socket.io
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;
    // Unirse a la sala de la clase
    socket.emit('join-class', classId, user);
    // Recibir nuevos usuarios
    socket.on('user-joined', (newUser) => {
      setEstudiantes((prev) => {
        if (prev.find((u) => u.nombre === newUser.nombre)) return prev;
        return [...prev, newUser];
      });
      toast.success(`${newUser.nombre} se ha unido al lobby`);
      playJoin();
    });
    // Recibir mensajes de chat
    socket.on('chat-message', (msg) => {
      setChat((prev) => [...prev.slice(-99), msg]);
    });
    // Recibir actualización de presencia
    socket.on('presence-update', (users) => {
      // Evitar duplicados
      const unique = [];
      users.forEach(u => {
        if (!unique.find(x => x.nombre === u.nombre)) unique.push(u);
      });
      setEstudiantes(unique);
    });
    // Conexión/desconexión
    socket.on('connect', () => setSocketConnected(true));
    socket.on('disconnect', () => setSocketConnected(false));
    // Animación/sonido al salir
    socket.on('user-left', (user) => {
      playLeave();
      toast(`${user.nombre} ha salido del lobby`, { icon: '👋' });
    });
    return () => {
      socket.disconnect();
    };
  }, [classId]);

  // Cargar estudiantes y chat inicial desde API (MongoDB)
  useEffect(() => {
    async function fetchLobbyData() {
      try {
        const res = await fetch(`/api/clases/lobby?classId=${classId}`);
        const data = await res.json();
        setAllEstudiantes(data.estudiantes || []); // Historial
        setChat((data.chat || []).slice(-100)); // Solo últimos 100 mensajes
      } catch (e) {
        toast.error('Error al cargar el lobby');
      }
    }
    fetchLobbyData();
  }, [classId]);

  // Enviar mensaje al chat
  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    setEnviando(true);
    const msg = {
      user: user.nombre,
      avatar: user.avatar,
      msg: mensaje,
      created_at: new Date().toISOString(),
    };
    socketRef.current.emit('chat-message', { classId, message: msg });
    setMensaje('');
    setEnviando(false);
    toast('💬 Mensaje enviado', { icon: '💬' });
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  // Feedback visual/sonoro al entrar/salir usuarios
  useEffect(() => {
    if (estudiantes.length > 0) {
      toast.success('¡Nuevo usuario conectado!', { icon: '⚡' });
      // Puedes agregar aquí efectos de sonido si lo deseas
    }
  }, [estudiantes.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col items-center justify-center p-4">
      {!socketConnected && (
        <div className="mb-4 p-4 bg-red-900/80 border border-red-500 text-red-200 rounded-lg animate-pulse-glow text-center font-bold">
          ❌ Conexión perdida. Intentando reconectar...
        </div>
      )}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl bg-black/70 rounded-2xl border-2 border-purple-700 shadow-2xl p-8 flex flex-col md:flex-row gap-8"
      >
        {/* Lista de estudiantes conectados */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-yellow-400 mb-4 flex items-center gap-2">
            👥 Estudiantes Conectados
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto pr-2">
            {estudiantes.map((est, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-900/80 to-black/80 rounded-xl p-2 flex flex-col items-center border-2 border-purple-600 shadow-lg relative min-w-[90px]"
              >
                <span className="absolute top-1 right-1 animate-pulse-glow bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-lg" title="Conectado"></span>
                <img src={est.avatar} alt={est.personaje} className="w-12 h-12 rounded-full border-2 border-yellow-400 mb-1 shadow-xl" />
                <div className="text-xs font-bold text-white text-center break-words max-w-[70px]">{est.nombre}</div>
                <div className="text-purple-300 text-[10px] text-center">{est.personaje}</div>
              </motion.div>
            ))}
          </div>
          {/* Historial de todos los estudiantes */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-blue-400 mb-2">Historial de la Clase</h3>
            <div className="flex flex-wrap gap-2">
              {allEstudiantes.map((est, i) => (
                <span key={i} className="px-3 py-1 bg-blue-900/60 rounded-full text-blue-200 text-sm border border-blue-500">
                  {est.nombre}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-3xl font-extrabold text-green-400 mb-4 flex items-center gap-2">
            💬 Chat de la Clase
          </h2>
          <div ref={chatRef} className="flex-1 bg-black/60 rounded-xl border border-green-700 p-4 mb-4 overflow-y-auto max-h-[350px]">
            {chat.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 mb-3 ${msg.user === user.nombre ? 'bg-green-900/30 rounded-lg p-2' : ''}`}>
                <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full border-2 border-purple-400" />
                <div>
                  <div className="font-bold text-purple-300 flex items-center gap-2">
                    {msg.user} <span className="text-xs text-gray-400">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <div className="text-white text-lg break-words">
                    {msg.msg}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={enviarMensaje} className="flex gap-2">
            <input
              type="text"
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-900 border-2 border-green-500 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Escribe un mensaje o emoji..."
              maxLength={200}
              disabled={enviando}
            />
            <button
              type="submit"
              disabled={enviando || !mensaje.trim()}
              className="px-5 py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 rounded-lg text-white font-bold text-lg transition-all shadow-lg disabled:cursor-not-allowed"
            >
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-purple-300 text-lg font-semibold animate-pulse-glow">
          Espera a que el profesor inicie la misión...<br />
          <span className="text-yellow-400">¡La energía maldita está aumentando!</span>
        </p>
      </motion.div>
    </div>
  );
} 