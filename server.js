const net = require('net');
const fs = require('fs');

const { PORT, HOSTNAME, SERVER_FILES_DIR } = require('./constants');

const addErrorListener = (stream) =>
  stream.on('error', (error) => console.log(error.message));

/**
 * Send the file list
 */
const sendFileList = (socket) => {
  fs.readdir(SERVER_FILES_DIR, (error, files) => {
    if (error) return console.log(error.message);
    return socket.write(JSON.stringify(files));
  });
};

/**
 * Send the file using the 'readable' API
 */
const sendFile_Write = (socket, files) => {
  console.log('Stream starting');
  const istream = fs.createReadStream(`${SERVER_FILES_DIR}/${files[0]}`);

  istream.on('readable', function () {
    let data;
    while (data = this.read()) {
      socket.write(data);
    }
  });
  istream.on('end', () => {
    console.log('Stream ending');
    socket.end();
  });
  addErrorListener(istream);
};

/**
 * Send the file using the pipe() API
 */
const sendFile_Pipe = (socket, files) => {
  console.log('Stream starting');
  const istream = fs.createReadStream(`${SERVER_FILES_DIR}/${files[0]}`);

  istream.pipe(socket);
  istream.on('end', () => console.log('Stream ending'));
  addErrorListener(istream);
  // Piping closes the socket automatically by default
};

/**
 * Launch the request
 */
const doRequest = (socket, cmd, args) => {
  switch (cmd) {
    case 'ls': return sendFileList(socket);
    case 'dlp': return sendFile_Pipe(socket, args);
    case 'dlw': return sendFile_Write(socket, args);
    default: return null;
  }
};

/**
 * Create the file server
 */
const server = net.createServer((socket) => {
  console.log('----------------\nClient connected');

  socket.on('data', (data) => {
    console.log(`Client request: ${data}`);
    const { cmd, args } = JSON.parse(data);
    doRequest(socket, cmd, args);
  });
  addErrorListener(socket);
});

server.listen(PORT, HOSTNAME);
console.log('Server created');
