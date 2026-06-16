import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  autoConnect: false, // conectăm manual după login
  withCredentials: true,
});

export default socket;