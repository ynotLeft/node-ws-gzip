import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'net';

const zlib = require('zlib');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const testObject = {
  user: {
    name: 'John Doe',
    age: 24,
    children: [
      {
        name: 'Jane Doe',
        age: 4,
      },
    ],
  },
};

wss.on('connection', (ws: WebSocket) => {

  // connection is up, let's add a simple event
  ws.on('message', (message: string) => {

    console.log('received: %s', message);

    zlib.gzip(JSON.stringify(testObject), (error: Error, result: Buffer) => {
      const deflatedObject = result;
      console.log('sending back: %s', deflatedObject);
      ws.send(deflatedObject);
    });

  });
});

// start our server
server.listen(process.env.PORT || 8999, () => {
  const address: AddressInfo = server.address() as AddressInfo;
  console.log(`Server started on port ${address.port}`);
});
