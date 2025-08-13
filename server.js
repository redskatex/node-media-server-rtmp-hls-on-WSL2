const NodeMediaServer = require('node-media-server');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // Porta web

// Servire file statici
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Pagina web attiva su http://localhost:${PORT}`);
});

// Percorso di FFmpeg su Linux (scoprilo con "which ffmpeg")
const ffmpegPath = '/usr/bin/ffmpeg';

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 4096,
    gop_cache: true,
    ping: 5,
    ping_timeout: 10,
    host: '0.0.0.0'
  },
  http: {
    port: 8000,
    mediaroot: path.join(__dirname, 'media'),
    allow_origin: '*'
  },
  trans: {
    ffmpeg: ffmpegPath,
    tasks: [
      {
        app: 'tv',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: false
      }
    ]
  }
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] prePublish', id, StreamPath, args);
});
nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] postPublish', id, StreamPath, args);
});
nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeMediaServer] donePublish', id, StreamPath, args);
});

nms.run();
