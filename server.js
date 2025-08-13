const NodeMediaServer = require('node-media-server');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // Porta web

// Servire file statici
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, process.env.HOST,() => {
  console.log(`Pagina web attiva su http://localhost:${PORT}`);
});

const config = {
  http: {
    port: process.env.HTTP_PORT || 8000,
    mediaroot: '/media',
    allow_origin: '*',
    host: process.env.HOST
  },
  rtmp: {
    port: process.env.RTMP_PORT || 1935,
    chunk_size: 4096,
    gop_cache: true,
    ping: 5,
    ping_timeout: 10,
    host: process.env.HOST
  }
};

const nms = new NodeMediaServer(config);

/*
nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] prePublish', id, StreamPath, args);
});
nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] postPublish', id, StreamPath, args);
});
nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] donePublish', id, StreamPath, args);
});
*/

nms.run();