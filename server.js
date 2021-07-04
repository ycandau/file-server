const net = require('net');
const fs = require('fs');

const [port, hostname] = [3000, 'localhost'];

const processMessage = (socket, cmd, args) => {
  switch (cmd) {
    case 'ls':
      fs.readdir('.', (error, files) => {
        if (error) return console.log(error);
        return socket.write(`ls:${files.join(',')}`);
      });
      break;
    case 'dl':
      break;
    default:
      break;
  }
};

/**
 * Create the file server
 */
const server = net.createServer((socket) => {
  console.log('Client connected');
  socket.on('end', () => console.log('Client disconnected'));
  socket.on('error', (error) => console.log(error.message));
  socket.on('data', (data) => {
    console.log(`Client request: ${data}`);
    const [cmd, ...args] = data.toString().split(' ');
    processMessage(socket, cmd, args);
  });
});

server.listen(port, hostname);
console.log('Server created');
