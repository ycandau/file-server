//------------------------------------------------------------------------------

const fs = require('fs');
const net = require('net');
const readline = require('readline');

const { PORT, HOSTNAME, CLIENT_FILES_DIR } = require('./constants');

const addErrorListener = (stream) =>
  stream.on('error', (error) => console.log(error.message));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Parse the user input
 */
const parseInput = (input) => {
  const msg = input.trim().replace(/ +/g, ' ');
  const [cmd, ...args] = msg.split(' ');
  return { cmd, args };
};

/**
 * Request the file list from the server
 */
const requestFileList = (cmd) => {
  console.log('Remote file list:');

  const socket = net.connect(PORT, HOSTNAME);
  socket.write(JSON.stringify({ cmd }));
  
  socket.on('data', (data) => {
    const files = JSON.parse(data);
    files.forEach((file) => console.log(`  ${file}`));
    socket.end();
    prompt();
  });
  addErrorListener(socket)
};

/**
 * Request a file from the server
 */
const requestFile = (cmd, args) => {
  console.log(`Downloading: ${args[0]}`);

  const socket = net.connect(PORT, HOSTNAME);
  const ostream = fs.createWriteStream(`${CLIENT_FILES_DIR}/${args[0]}`);
  socket.pipe(ostream);
  socket.write(JSON.stringify({ cmd, args }));

  socket.on('end', prompt);
  addErrorListener(socket)
};

/**
 * Exit the read-eval loop
 */
const exit = () => rl.close();

/**
 * Invalid entry
 */
const invalid = () => {
  console.log('Invalid command');
  prompt();
};

/**
 * Prompt the user for the next command
 */
function prompt() {
  rl.question('> ', (input) => {
    const { cmd, args } = parseInput(input);
    switch (cmd) {
      case 'ls': return requestFileList(cmd);
      case 'dlw': case 'dlp': return requestFile(cmd, args);
      case 'exit': return exit();
      default: return invalid();
    }
  });
}

/**
 * Start the script
 */
prompt();
