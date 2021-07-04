//------------------------------------------------------------------------------

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (client) => {
  rl.question('> ', (answer) => {
    switch (answer) {
      case 'ls':
        console.log('ls');
        ask(client);
        break;
      case 'dl':
        console.log('dl');
        ask(client);
        break;
      case 'end':
        console.log('end');
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
