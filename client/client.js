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
        console.log('Remote file list:');
        client.write('ls');
        break;
      case 'dl':
        console.log('Downloading:');
        client.write(msg);
        ask(client);
        break;
      case 'exit':
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

client.on('close', () => console.log('Connection closed'));

client.on('error', () => console.log('Connection failed'));

client.on('data', (data) => {
  const msg = data.toString();
  const cmd = msg.slice(0, 2);
  const files = msg.slice(3).split(',').sort();
  files.forEach((file) => console.log(`  ${file}`));
  ask(client);
});
