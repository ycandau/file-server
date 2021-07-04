//------------------------------------------------------------------------------

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const parseInput = (input) => {
  const msg = input.trim().replace(/ +/g, ' ');
  const [cmd] = msg.split(' ');
  return { cmd, msg };
};

const ask = (client) => {
  rl.question('> ', (input) => {
    const { cmd, msg } = parseInput(input);
    switch (cmd) {
      case 'ls':
        console.log('Requesting file list...');
        client.write('ls');
        ask(client);
        break;
      case 'dl':
        console.log('Downloading...');
        client.write(msg);
        ask(client);
        break;
      case 'end':
        rl.close();
        client.end();
        break;
      default:
        console.log('Invalid command');
        ask(client);
        break;
    }
  });
};

//------------------------------------------------------------------------------

const net = require('net');

const [port, hostname] = [3000, 'localhost'];

const client = new net.Socket();

client.connect(port, hostname, () => {
  console.log('Connected to server');
  ask(client);
});

client.on('data', (data) => console.log(`From server: ${data}`));

client.on('close', () => console.log('Connection closed'));

client.on('error', () => console.log('Connection failed'));
