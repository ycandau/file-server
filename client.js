const net = require('net');

const [port, hostname] = [3000, 'localhost'];

const client = new net.Socket();

client.connect(port, hostname, () => console.log('Connected to server'));

client.on('data', (data) => console.log(`From server: ${data}`));

client.on('close', () => console.log('Connection closed'));

client.on('error', () => console.log('Connection failed'));
