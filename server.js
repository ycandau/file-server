const net = require('net');

const [port, hostname] = [3000, 'localhost'];

/**
 * Create the file server
 */
const server = net.createServer((socket) => {
  console.log('Client connected');
  socket.on('end', () => console.log('Client disconnected'));
  socket.on('error', (error) => console.log(error.message));
  socket.on('data', (data) => console.log(`Client request: ${data}`));
});

server.listen(port, hostname);
console.log('Server created');
